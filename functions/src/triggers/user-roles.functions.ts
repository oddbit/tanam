import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { AdminTanamUser, AdminTanamUserRole } from '../models/cloud-functions.models';
import { ITanamUser, ITanamUserRole } from '../models';

// noinspection JSUnusedGlobalSymbols
export const onUserRoleCreate = functions.firestore.document('tanam/{siteId}/user-roles/{roleId}').onCreate(async (snap) => {
  const userRole = new AdminTanamUserRole(snap.data() as ITanamUserRole);
  const firebaseUser = await admin.auth().getUserByEmail(userRole.email);
  if (!firebaseUser) {
    console.log(`No user registered yet for ${userRole.toString()}`);
    return null;
  }

  userRole.setFirebaseUser(firebaseUser);
  return snap.ref.set(userRole.toJson());
});

// noinspection JSUnusedGlobalSymbols
export const onUserRoleChange = functions.firestore.document('tanam/{siteId}/user-roles/{roleId}').onWrite(async (change, context) => {
  const siteId = context.params.siteId;
  const siteRef = admin.firestore().collection('tanam').doc(siteId);
  const roleBefore = change.before.exists ? new AdminTanamUserRole(change.before.data() as ITanamUserRole) : null;
  const roleAfter = change.after.exists ? new AdminTanamUserRole(change.after.data() as ITanamUserRole) : null;
  const promises = [];

  if (!change.before.exists) {
    console.log(`Nothing to do for "create operation"`);
    return null;
  }

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
    trxUser.roles = tanamClaims[siteId].slice();
    return trx.set(userRef, trxUser.toJson());
  }));


  return Promise.all(promises);
});

