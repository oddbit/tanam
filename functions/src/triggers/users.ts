import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { AdminTanamUser, AdminTanamUserRole } from "../models/cloud-functions.models";
import { ITanamUserRole } from "../models";

// noinspection JSUnusedGlobalSymbols
export const onAccountCreate = functions.auth.user().onCreate(async (firebaseUser) => {
  console.log(JSON.stringify({uid: firebaseUser.uid, email: firebaseUser.email}));
  const batchWrite = admin.firestore().batch();
  const siteIds = [];

  const tanamUser = AdminTanamUser.fromFirebaseUser(firebaseUser);
  const result = await admin.firestore()
    .collectionGroup('user-roles')
    .where('email', '==', tanamUser.email)
    .get();

  for (const doc of result.docs) {
    const siteId = doc.ref.parent.parent.id;
    siteIds.push(siteId);

    const role = new AdminTanamUserRole(doc.data() as ITanamUserRole);
    role.uid = tanamUser.id;
    role.name = tanamUser.name;

    console.log(JSON.stringify({siteId, role: role.toString()}));
    batchWrite.update(doc.ref, role.toJson());
  }

  siteIds.forEach((siteId) => {
    console.log(JSON.stringify({siteId, uid: tanamUser.uid}));
    const ref = admin.firestore()
      .collection('tanam').doc(siteId)
      .collection('users').doc(tanamUser.uid);
    batchWrite.set(ref, tanamUser.toJson());
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
