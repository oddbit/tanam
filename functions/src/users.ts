import { MD5 } from 'crypto-js';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { UserRecord } from "firebase-functions/lib/providers/auth";

export const tanamOnAuthAccountCreate: functions.CloudFunction<UserRecord>
    = functions.auth.user().onCreate(async (firebaseUser) => {
        // Check if there are less than 2 users. First user becomes owner.
        const allUsers = await admin.auth().listUsers(2);
        const isFirstUser = allUsers.users.length < 2;

        // Use gravatar as default if photoUrl isn't specified in user data
        // https://en.gravatar.com/site/implement/images/
        const gravatarHash = MD5(firebaseUser.email || firebaseUser.uid).toString().toLowerCase();
        const user = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email,
            email: firebaseUser.email,
            photoUrl: firebaseUser.photoURL || `https://www.gravatar.com/avatar/${gravatarHash}.jpg?s=1024&d=identicon`,
            roles: isFirstUser ? ['owner'] : [],
        };

        return Promise.all([
            admin.firestore().collection('tanam-users').doc(user.uid).set(user),
            setUserRoleToAuth(user),
        ]);
    });

export const tanamOnAuthAccountDelete: functions.CloudFunction<UserRecord>
    = functions.auth.user().onDelete(firebaseUser => {
        return admin.firestore().collection('tanam-users').doc(firebaseUser.uid).delete();
    });

export const tanamOnUserUpdate: functions.CloudFunction<functions.Change<FirebaseFirestore.DocumentSnapshot>>
    = functions.firestore.document("tanam-users/{uid}").onUpdate((change, context) => {
        const uid = context.params.uid;
        const userBefore = change.before.data() as any;
        const userAfter = change.after.data() as any;

        const promises = [];

        if (userBefore.roles.length !== userAfter.roles.length
            || userBefore.roles.some((role: string) => userAfter.roles.indexOf(role) === -1)) {
            promises.push(setUserRoleToAuth({ uid: uid, roles: userAfter.roles as string[] }));
        }

        return Promise.all(promises);
    });


function setUserRoleToAuth({ uid, roles }: { uid: string, roles: string[] }) {
    console.log(`[setUserRoleToAuth] Setting roles: ${JSON.stringify({ uid, roles })}`);
    return admin.auth().setCustomUserClaims(uid, { tanam: roles });
}
