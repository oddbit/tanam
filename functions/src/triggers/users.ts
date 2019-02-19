import { MD5 } from 'crypto-js';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export const createUser = functions.auth.user().onCreate(async (firebaseUser) => {
    // Use gravatar as default if photoUrl isn't specified in user data
    // https://en.gravatar.com/site/implement/images/
    const gravatarHash = MD5(firebaseUser.email || firebaseUser.uid).toString().toLowerCase();
    const user = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email,
        email: firebaseUser.email,
        photoUrl: firebaseUser.photoURL || `https://www.gravatar.com/avatar/${gravatarHash}.jpg?s=1024&d=identicon`,
        roles: firebaseUser.email === process.env.TANAM_OWNER ? ['owner'] : [],
    };

    return Promise.all([
        admin.firestore()
            .collection('tanam').doc(process.env.GCLOUD_PROJECT)
            .collection('users').doc(firebaseUser.uid)
            .set(user),
        setUserRoleToAuth(user),
    ]);
});

export const deleteUser = functions.auth.user().onDelete(firebaseUser => {
    return admin.firestore()
        .collection('tanam').doc(process.env.GCLOUD_PROJECT)
        .collection('users').doc(firebaseUser.uid)
        .delete();
});

export const updateAuthRoles = functions.firestore.document('tanam/{siteId}/users/{uid}').onUpdate((change, context) => {
    const uid = context.params.uid;
    const userBefore = change.before.data();
    const userAfter = change.after.data();

    const promises = [];

    if (userBefore.roles.length !== userAfter.roles.length
        || userBefore.roles.some((role) => userAfter.roles.indexOf(role) === -1)) {
        promises.push(setUserRoleToAuth({ uid: uid, roles: userAfter.roles as string[] }));
    }

    return Promise.all(promises);
});


function setUserRoleToAuth({ uid, roles }: { uid: string, roles: string[] }) {
    console.log(`[setUserRoleToAuth] Setting roles: ${JSON.stringify({ uid, roles })}`);
    return admin.auth().setCustomUserClaims(uid, { tanam: roles });
}
