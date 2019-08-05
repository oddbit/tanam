import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { ITanamUserInvite, TanamUserInvite, ITanamUser } from "../models";
import { AdminTanamUser } from "../models/cloud-functions.models";

// noinspection JSUnusedGlobalSymbols
export const onAccountCreate = functions.auth.user().onCreate(async (firebaseUser) => {
  console.log(JSON.stringify({ uid: firebaseUser.uid, email: firebaseUser.email }));
  const batchWrite = admin.firestore().batch();
  const siteRoles = {};

  const tanamUser = AdminTanamUser.fromFirebaseUser(firebaseUser);

  // Find all pending invites across all sites
  const invites = await admin.firestore()
    .collectionGroup('user-invites')
    .where('email', '==', tanamUser.email)
    .get();

  for (const doc of invites.docs) {
    const siteId = doc.ref.parent.parent.id;
    const role = new TanamUserInvite(doc.data() as ITanamUserInvite);
    siteRoles[siteId] = role.roles;
  }

  console.log(JSON.stringify({ siteRoles }));

  Object.keys(siteRoles).forEach((siteId) => {
    console.log(JSON.stringify({ siteId, uid: tanamUser.uid }));
    const ref = admin.firestore()
      .collection('tanam').doc(siteId)
      .collection('users').doc(tanamUser.uid);

    batchWrite.set(ref, {
      ...tanamUser.toJson(),
      roles: siteRoles[siteId] || [],
    });

    const userInviteRef = admin.firestore()
      .collection('tanam').doc(siteId)
      .collection('user-invites').doc(tanamUser.email);

    batchWrite.delete(userInviteRef)
  });

  return Promise.all([
    batchWrite.commit(),
    admin.auth().setCustomUserClaims(tanamUser.id, { tanam: siteRoles }),
  ]);
});

// noinspection JSUnusedGlobalSymbols
export const onAccountDelete = functions.auth.user().onDelete(async firebaseUser => {
  console.log(`Deleting account: ${JSON.stringify({ firebaseUser })}`);
  const batchWrite = admin.firestore().batch();
  const result = await admin.firestore()
    .collectionGroup('user')
    .where('uid', '==', firebaseUser.uid)
    .get();

  for (const doc of result.docs) {
    console.log(`Deleting: ${doc.ref.path}`);
    batchWrite.delete(doc.ref);
  }

  return batchWrite.commit();
});

export const onUserRoleChange = functions.firestore.document('tanam/{siteId}/users/{userId}').onUpdate(async (change, context) => {
  const siteId = context.params.siteId;
  const userId = context.params.userId;
  const userBefore = new AdminTanamUser(change.before.data() as ITanamUser);
  const userAfter = new AdminTanamUser(change.after.data() as ITanamUser);

  // Check for role changes
  if (userBefore.roles.length === userAfter.roles.length && userBefore.roles.every(role => userAfter.roles.indexOf(role) >= 0)) {
    console.log(`No changes to the roles of the user. Nothing to do.`);
    return null;
  }

  const firebaseUser = await admin.auth().getUser(userId);
  const customClaimsBefore = firebaseUser.customClaims || {};
  console.log(JSON.stringify({ customClaimsBefore }));

  const tanamClaims = customClaimsBefore['tanam'] || {};
  tanamClaims[siteId] = userAfter.roles.slice();

  const customClaimsAfter = { tanam: tanamClaims };
  console.log(JSON.stringify({ customClaimsAfter }));

  return admin.auth().setCustomUserClaims(userId, customClaimsAfter);
});
