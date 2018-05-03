import * as firebase from "firebase-admin";
import * as functions from "firebase-functions";
import { Change, EventContext } from "firebase-functions";
import { UserRecord } from "firebase-functions/lib/providers/auth";
import { MD5 } from "crypto-js";

interface UserProfile {
    name: string;
    email: string;
    photoUrl?: string;
    role: string;
}

/**
 * Clean up user data if an account is being removed.
 */
export function cleanUpDeletedUser(firebaseUser: UserRecord) {
    console.log(`[tanam.cleanUpDeletedUser] User account deleted: ${firebaseUser.email} (${firebaseUser.uid})`);
    return firebase.firestore().collection("users").doc(firebaseUser.uid).delete();
}

/**
 * Create a user document when a Firebase account is being created.
 */
export function scaffoldNewUserProfile(firebaseUser: UserRecord) {
    const ownerEmail = functions.config().tanam && functions.config().tanam.owner;
    const role = ownerEmail === firebaseUser.email ? "owner" : "guest";
    console.log(`[tanam.scaffoldNewUserProfile] New account email=${firebaseUser.email}, role=${role}, uid=${firebaseUser.uid}`);

    // Use gravatar as default if photoUrl isn't specified in user data
    // https://en.gravatar.com/site/implement/images/
    const gravatarHash = MD5(firebaseUser.email).toString().toLowerCase();
    const userProfile: UserProfile = {
        name: firebaseUser.displayName || firebaseUser.email,
        email: firebaseUser.email,
        photoUrl: firebaseUser.photoURL || `https://www.gravatar.com/avatar/${gravatarHash}.jpg?s=1024&d=identicon`,
        role: role
    };

    return Promise.all([
        firebase.firestore().collection("users").doc(firebaseUser.uid).set(userProfile),
        firebase.auth().setCustomUserClaims(firebaseUser.uid, { role: role })
    ]);
}

export function onUserUpdated(change: Change<FirebaseFirestore.DocumentSnapshot>, context?: EventContext) {
    if (!context) {
        throw new Error("Context parameter not set. Tanam can not make updates without knowing the UID.");
    }

    const userBefore = change.before.data() as UserProfile;
    const userAfter = change.after.data() as UserProfile;
    const uid = context.params.uid;

    const promises = [];

    if (userBefore.role !== userAfter.role) {
        console.log(`[tanam.onUserUpdated] User role changed from=${userBefore.role}, to=${userAfter.role}, uid=${uid}`);
        promises.push(firebase.auth().setCustomUserClaims(uid, { role: userAfter.role }));
    }

    return Promise.all(promises);
}