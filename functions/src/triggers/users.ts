import { MD5 } from 'crypto-js';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { AdminTanamUser, AdminTanamUserRole } from "../models/cloud-functions.models";
import { ITanamUser, ITanamUserRole } from "../models";

// noinspection JSUnusedGlobalSymbols
export const onAccountCreate = functions.auth.user().onCreate(async (firebaseUser) => {
  console.log(JSON.stringify({uid: firebaseUser.uid, email: firebaseUser.email}));
  const batchWrite = admin.firestore().batch();
  const siteIds = [];

  // Use gravatar as default if photoUrl isn't specified in user data
  // https://en.gravatar.com/site/implement/images/
  const gravatarHash = MD5(firebaseUser.email || firebaseUser.uid).toString().toLowerCase();

  const user = new AdminTanamUser({
    uid: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email,
    email: firebaseUser.email,
    photoUrl: firebaseUser.photoURL || `https://www.gravatar.com/avatar/${gravatarHash}.jpg?s=1024&d=identicon`,
  } as ITanamUser);

  const result = await admin.firestore()
    .collectionGroup('user-roles')
    .where('email', '==', user.email)
    .get();

  for (const doc of result.docs) {
    const siteId = doc.ref.parent.parent.id;
    siteIds.push(siteId);

    const role = new AdminTanamUserRole(doc.data() as ITanamUserRole);
    role.uid = user.uid;
    role.name = user.name;

    console.log(JSON.stringify({siteId, role: role.toString()}));
    batchWrite.update(doc.ref, role.toJson());
  }

  siteIds.forEach((siteId) => {
    console.log(JSON.stringify({siteId, uid: user.uid}));
    const ref = admin.firestore()
      .collection('tanam').doc(siteId)
      .collection('users').doc(user.uid);
    batchWrite.set(ref, user.toJson());
  });

  return batchWrite.commit();
});

// noinspection JSUnusedGlobalSymbols
export const onAccountDelete = functions.auth.user().onDelete(async firebaseUser => {
  console.log(`Deleting account: ${JSON.stringify({firebaseUser})}`);
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

// noinspection JSUnusedGlobalSymbols
export const onUserRoleChange = functions.firestore.document('tanam/{siteId}/user-roles/{roleId}').onWrite(async (change, context) => {
  const siteId = context.params.siteId;
  const siteRef = admin.firestore().collection('tanam').doc(siteId);
  const roleBefore = change.before.exists ? new AdminTanamUserRole(change.before.data() as ITanamUserRole) : null;
  const roleAfter = change.after.exists ? new AdminTanamUserRole(change.after.data() as ITanamUserRole) : null;
  const promises = [];

  console.log(JSON.stringify({
    userBefore: (roleBefore && roleBefore.toString()),
    userAfter: (roleBefore && roleBefore.toString()),
  }));

  const uid = (roleBefore && roleBefore.uid) || (roleAfter && roleAfter.uid);
  if (!uid) {
    console.log(`There is no UID yet for this role. Nothing more to do.`);
    return null;
  }

  if (roleBefore && roleAfter && roleBefore.unchangedRoleAuth(roleAfter)) {
    console.log(`Role auth is unchanged. Nothing more to do.`);
    return null;
  }

  const firebaseUser = await admin.auth().getUser(uid);
  const customClaimsBefore = firebaseUser.customClaims || {};
  console.log(JSON.stringify({customClaimsBefore}));
  const tanamClaims = customClaimsBefore['tanam'] || {};
  const roleResults = await siteRef.collection('user-roles').where('uid', '==', uid).get();
  tanamClaims[siteId] = roleResults.docs.map(doc => new AdminTanamUserRole(doc.data() as ITanamUserRole).role);

  const customClaimsAfter = {tanam: tanamClaims};
  console.log(JSON.stringify({customClaimsAfter}));
  promises.push(admin.auth().setCustomUserClaims(uid, customClaimsAfter));

  const userRef = siteRef.collection('users').doc(uid);
  promises.push(admin.firestore().runTransaction(async (trx) => {
    const trxUserDoc = await trx.get(userRef);
    const trxUser = new AdminTanamUser(trxUserDoc.data() as ITanamUser);

    return trx.set(userRef, trxUser.toJson());
  }));


  return Promise.all(promises);
});
