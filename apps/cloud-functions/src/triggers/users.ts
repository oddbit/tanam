import { TanamRole } from "@tanam/shared";
import axios from "axios";
import * as admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import { logger } from "firebase-functions/v2";
import { onDocumentCreated, onDocumentDeleted, onDocumentUpdated } from "firebase-functions/v2/firestore";
import { onObjectFinalized } from "firebase-functions/v2/storage";
import sharp from "sharp";
import { TanamUserAdmin } from "../models/TanamUserAdmin";

const auth = admin.auth();
const db = admin.firestore();
const storage = admin.storage();

// Function to validate and assign role on document creation
// This function will scaffold and create a new user document with a role field
// and assert that all the document fields are populated.
export const tanamNewUserInit = onDocumentCreated("tanam-users/{docId}", async (event) => {
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
    colorMode: "light",
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
export const onTanamUserRoleChange = onDocumentUpdated("tanam-users/{docId}", async (event) => {
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

// Function to download and store user profile image
// This function will download the user's profile image from Firebase Auth
// and store it in Cloud Storage when a new user is created.
export const tanamNewUserGetImage = onDocumentCreated("tanam-users/{docId}", async (event) => {
  const uid = event.params.docId;
  const firebaseUser = await auth.getUser(uid);

  const imageUrl = firebaseUser.photoURL;
  if (!imageUrl) {
    logger.info("No photoURL found for user");
    return;
  }

  try {
    logger.info(`Making a cloud storage copy for user image`, {uid, imageUrl});
    const response = await axios.get(imageUrl, {responseType: "arraybuffer"});
    const buffer = Buffer.from(response.data, "binary");

    // Define the file path in Cloud Storage
    const filePath = `tanam-users/${uid}/new-profile-image`;
    const file = storage.bucket().file(filePath);

    // Upload the image to Cloud Storage
    await file.save(buffer, {
      metadata: {
        contentType: response.headers["content-type"],
      },
    });

    logger.info(`Image uploaded to ${filePath}`);
  } catch (error) {
    logger.error("Error uploading image to Cloud Storage", error);
  }
});

// Function to process user profile image
// This function will resize and convert the user's profile image to standard dimensions and format.
// This ensures that images are optimized for performance and consistency.
// New images should be uploaded to the Cloud Storage bucket with the path `tanam-users/{uid}/new-profile-image`.
export const processUserProfileImage = onObjectFinalized(async (event) => {
  const filePath = event.data.name;
  const contentType = event.data.contentType;
  const bucket = storage.bucket(event.bucket);
  const promises = [];
  if (!filePath || !contentType) {
    logger.error("File path or content type is missing", {filePath, contentType});
    return;
  }

  const match = filePath.match(/tanam-users\/([^/]+)\/new-profile-image/);
  if (!match) {
    logger.info("Not a new profile image, skipping", {filePath});
    return;
  }

  const uid = match[1];
  const tempFilePath = `/tmp/${uid}-new-profile-image`;

  try {
    // Download the file to a temporary location
    await bucket.file(filePath).download({destination: tempFilePath});

    // Process the image: resize and convert to PNG
    const imageSize = 1024;
    const processedImageBuffer = await sharp(tempFilePath)
      .resize(imageSize, imageSize, {fit: "inside"})
      .png()
      .toBuffer();

    // Define the new file path
    const newFilePath = `tanam-users/${uid}/profile.png`;
    const newFile = bucket.file(newFilePath);

    // Upload the processed image to Cloud Storage
    promises.push(
      newFile.save(processedImageBuffer, {
        metadata: {
          contentType: "image/png",
        },
      }),
    );

    logger.info("Profile image processed and uploaded", {newFilePath});

    // Delete the original file
    logger.info("Deleting unprocessed uploaded file", {filePath});
    promises.push(bucket.file(filePath).delete());
  } catch (error) {
    logger.error("Error processing image", error);
  } finally {
    await Promise.all(promises);
  }
});
