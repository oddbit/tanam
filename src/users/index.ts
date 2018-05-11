import * as firebase from "firebase-admin";
import * as functions from "firebase-functions";
import { Change, EventContext } from "firebase-functions";
import { UserRecord } from "firebase-functions/lib/providers/auth";
import { MD5 } from "crypto-js";

export class User {
    uid: string;
    name: string;
    email: string;
    photoUrl: string;
    role: string;

    constructor(user: User) {
        this.uid = user.uid;
        this.name = user.name;
        this.email = user.email;
        this.photoUrl = user.photoUrl;
        this.role = user.role;
    }

    toJson() {
        return {
            name: this.name,
            email: this.email,
            photoUrl: this.photoUrl,
            role: this.role
        };
    }
}

export function remove(uid: string) {
    console.log(`[tanam.user.remove] uid: ${uid}`);
    return firebase.firestore().collection("users").doc(uid).delete();
}

export function save(user: User) {
    return firebase.firestore().collection("users").doc(user.uid).set(user.toJson());
}

/**
 * Applies the `User.role` to firebase auth custom claims so that we can make role based auth
 * in both databases and cloud storage.
 *
 * @param user `User`
 */
export function setUserRoleToAuth(user: User) {
    console.log(`[setUserRoleToAuth] Updating auth with: {role: ${user.role}, uid: ${user.uid}}`);
    return firebase.auth().setCustomUserClaims(user.uid, { role: user.role });
}

/**
 * Create a Tanam user object from firebase auth user
 *
 * @param firebaseUser Firebase auth user
 */
export function createUserFromFirebaseAuth(firebaseUser: UserRecord) {
    // Use gravatar as default if photoUrl isn't specified in user data
    // https://en.gravatar.com/site/implement/images/
    const gravatarHash = MD5(firebaseUser.email).toString().toLowerCase();

    // Check for preconfigured owner of this site
    const ownerEmail = (functions.config().tanam && functions.config().tanam.owner) || "-";

    return new User({
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email,
        email: firebaseUser.email,
        photoUrl: firebaseUser.photoURL || `https://www.gravatar.com/avatar/${gravatarHash}.jpg?s=1024&d=identicon`,
        role: ownerEmail === firebaseUser.email ? "owner" : "guest"
    } as User);
}