import * as admin from "firebase-admin";
import {Timestamp} from "firebase-admin/firestore";
import {logger} from "firebase-functions/v2";
import {onDocumentCreated, onDocumentDeleted, onDocumentUpdated} from "firebase-functions/v2/firestore";
import {TanamRole} from "../models/TanamUser";
import {TanamUserAdmin} from "../models/TanamUserAdmin";

const auth = admin.auth();
const db = admin.firestore();

// Function to validate and assign role on document creation
// This function will scaffold and create a new user document with a role field
// and assert that all the document fields are populated.
export const onTanamUserCreated = onDocumentCreated("tanam-users/{docId}", async (event) => {
  const uid = event.params.docId;
  const docRef = db.collection("tanam-users").doc(uid);
  const docData = (await docRef.get()).data() || {};

  logger.info(`Validating User ID: ${uid}`);
  try {
    await auth.getUser(uid);
  } catch (error) {
    console.log("Document ID does not match any Firebase Auth UID, deleting document");
    return docRef.delete();
  }

  const firebaseUser = await auth.getUser(uid);
  const existingDocs = await db.collection("tanam-users").get();
  const tanamUser = new TanamUserAdmin(uid, {
    ...docData,
    name: firebaseUser.displayName,
    role: existingDocs.size === 1 ? "admin" : "publisher",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  logger.info("Creating User", tanamUser.toJson());

  const customClaimsBefore = (await auth.getUser(uid)).customClaims || {};
  const customClaimsAfter = {...customClaimsBefore, tanamRole: tanamUser.role};

  logger.info(`Setting custom claims for ${uid}`, {
    customClaimsBefore,
    customClaimsAfter,
  });

  return Promise.all([auth.setCustomUserClaims(uid, customClaimsAfter), docRef.set(tanamUser.toJson())]);
});

// Function to enforce role management on document update
// This function will apply changes to custom claims when the role field is updated
export const onRoleChange = onDocumentUpdated("tanam-users/{docId}", async (event) => {
  const uid = event.params.docId;
  const beforeData = event?.data?.before.data();
  const afterData = event?.data?.after.data();
  if (!beforeData || !afterData) {
    throw new Error("Document data is undefined");
  }

  if (beforeData.role === afterData.role) {
    logger.debug(`Role unchanged for ${uid}. Stopping here.`);
    return;
  }

  const supportedRoles: TanamRole[] = ["admin", "publisher"];
  if (!supportedRoles.includes(afterData.role)) {
    logger.error(`Role ${afterData.role} is not supported. Doing nothing.`);
    return;
  }

  logger.info(`Role change detected for ${uid}.`, {before: beforeData.role, after: afterData.role});
  return auth.setCustomUserClaims(uid, {tanamRole: afterData.role});
});

// Function to remove role on document deletion
export const onTanamUserDeleted = onDocumentDeleted("tanam-users/{docId}", async (event) => {
  const uid = event.params.docId;

  console.log(`Document deleted: ${uid}, removing custom claims`);
  const customClaims = (await auth.getUser(uid)).customClaims || {};
  customClaims.tanamRole = undefined;

  logger.info(`Tanam user deleted, removing custom claims for ${uid}`, {
    customClaims,
  });

  await auth.setCustomUserClaims(uid, customClaims);
});
