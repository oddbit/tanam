import * as firebase from "firebase-admin";
import { MD5 } from "crypto-js";
import { UserRecord } from "firebase-functions/lib/providers/auth";

interface UserProfile {
    name: string;
    email: string;
    photoUrl?: string;
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
    console.log(`[tanam.scaffoldNewUserProfile] New account: ${firebaseUser.email} (${firebaseUser.uid})`);
    console.log(JSON.stringify(firebaseUser));

    // Use gravatar as default if photoUrl isn't specified in user data
    // https://en.gravatar.com/site/implement/images/
    const gravatarHash = MD5(firebaseUser.email).toString().toLowerCase();
    const userProfile: UserProfile = {
        name: firebaseUser.displayName || firebaseUser.email,
        email: firebaseUser.email,
        photoUrl: firebaseUser.photoURL || `https://www.gravatar.com/avatar/${gravatarHash}.jpg?s=1024&d=identicon`,
    };

    return firebase.firestore().collection("users").doc(firebaseUser.uid).set(userProfile);
}