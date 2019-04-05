import { MD5 } from 'crypto-js';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as configService from '../services/config.service';
import * as siteService from '../services/site-info.service';

export const createUser = functions.auth.user().onCreate(async (firebaseUser) => {
    const tanamConfig = configService.getConfig();

    const tanamConfigRole = tanamConfig.users ? tanamConfig.users[firebaseUser.email] : null;
    const envRole = firebaseUser.email === process.env.TANAM_OWNER ? 'owner' :  null;
    const initialRole = envRole || tanamConfigRole;

    // Use gravatar as default if photoUrl isn't specified in user data
    // https://en.gravatar.com/site/implement/images/
    const gravatarHash = MD5(firebaseUser.email || firebaseUser.uid).toString().toLowerCase();
    const user = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email,
        email: firebaseUser.email,
        photoUrl: firebaseUser.photoURL || `https://www.gravatar.com/avatar/${gravatarHash}.jpg?s=1024&d=identicon`,
        roles: [initialRole],
    };

    console.log(`Creating account: ${JSON.stringify({ user })}`);
    return Promise.all([
        siteService.initializeSite(),
        admin.firestore()
            .collection('tanam').doc(process.env.GCLOUD_PROJECT)
            .collection('users').doc(firebaseUser.uid)
            .set(user),
        setUserRoleToAuth(user),
    ]);
});

export const deleteUser = functions.auth.user().onDelete(firebaseUser => {
    console.log(`Deleting account: ${JSON.stringify({ firebaseUser })}`);
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
        || userBefore.roles.some((role: string) => userAfter.roles.indexOf(role) === -1)) {
        promises.push(setUserRoleToAuth({ uid: uid, roles: userAfter.roles as string[] }));
    }

    return Promise.all(promises);
});


function setUserRoleToAuth({ uid, roles }: { uid: string, roles: string[] }) {
    const customClaims = { tanam: { [process.env.GCLOUD_PROJECT]: roles } };
    console.log(`[setUserRoleToAuth] ${JSON.stringify({ uid, customClaims })}`);
    return admin.auth().setCustomUserClaims(uid, customClaims);
}
