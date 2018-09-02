import * as functions from 'firebase-functions';
import * as users from './models';

export const tanamOnAuthAccountCreate = functions.auth.user().onCreate(async (firebaseUser) => {
  const userProfile = await users.createUserFromFirebaseAuth(firebaseUser);
  return Promise.all([
    users.save(userProfile),
    users.setUserRoleToAuth(userProfile)
  ]);
});

export const tanamOnAuthAccountDelete = functions.auth.user().onDelete(firebaseUser => {
  return users.remove(firebaseUser.uid);
});

export const tanamOnUserUpdate = functions.firestore.document("users/{uid}").onUpdate((change, context) => {
  const userBefore = new users.User(change.before.data() as users.User);
  const userAfter = new users.User(change.after.data() as users.User);
  const promises = [];

  if (userBefore.role !== userAfter.role) {
    promises.push(users.setUserRoleToAuth(userAfter));
  }

  return Promise.all(promises);
});