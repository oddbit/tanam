import {TanamDocument} from "@tanam/domain-backend";
import {getFirestore} from "firebase-admin/firestore";
import {getFunctions} from "firebase-admin/functions";
import {getStorage} from "firebase-admin/storage";
import {logger} from "firebase-functions/v2";
import {onDocumentWritten} from "firebase-functions/v2/firestore";
import {onTaskDispatched} from "firebase-functions/v2/tasks";

// Document publish change handler
// This function is handling updates when a document is published or unpublished.
// It will ignore updates that does not change the publish status of the document.
export const onPublishChange = onDocumentWritten("tanam-documents/{documentId}", async (event) => {
  const documentId = event.params.documentId;
  const unpublishQueue = getFunctions().taskQueue("taskUnpublishDocument");
  const publishQueue = getFunctions().taskQueue("taskPublishDocument");
  if (!event.data || !event.data.after.exists) {
    logger.info("Document was deleted. Unpublishing document.");
    return unpublishQueue.enqueue({documentId});
  }

  const documentBefore = TanamDocument.fromFirestore(event.data.before);
  const documentAfter = TanamDocument.fromFirestore(event.data.after);

  if (documentBefore.status === documentAfter.status) {
    logger.info("Document status did not change. Skipping.");
    return;
  }

  if (documentAfter.status === "published") {
    logger.info("Document was published.");
    return publishQueue.enqueue({documentId});
  }

  if (documentAfter.status === "unpublished" && documentBefore.status === "published") {
    logger.info("Document was unpublished", documentAfter.toJson());
    return unpublishQueue.enqueue({documentId});
  }

  const publishedAt = documentAfter.publishedAt?.toDate();
  if (documentAfter.status === "scheduled" && !!publishedAt) {
    logger.info("Document has been scheduled", documentAfter.toJson());
    if (publishedAt !== normalizeDateToMaxOffset(publishedAt)) {
      logger.error("Scheduled date is too far in the future", documentAfter.toJson());
      throw new Error("Scheduled date is too far in the future");
    }

    logger.info(`Enqueueing document for publishing at ${publishedAt}`, documentAfter.toJson());
    await publishQueue.enqueue(
      {documentId},
      {
        scheduleTime: publishedAt,
      },
    );
  }
});

// Task to publish a document
// This task is responsible for copying the document data to the public collection
// and copying associated files to the cloud storage public directory.
export const taskPublishDocument = onTaskDispatched(
  {
    retryConfig: {
      maxAttempts: 3,
      minBackoffSeconds: 60,
    },
    rateLimits: {
      // Try to give room for concurrency of documents in firestore
      maxDispatchesPerSecond: 1,
    },
  },
  async (req) => {
    const documentId = req.data.documentId;
    const documentRef = getFirestore().collection("tanam-documents").doc(documentId);
    const publicDocumentRef = getFirestore().collection("tanam-public").doc(documentId);
    const snap = await documentRef.get();

    if (!snap.exists) {
      logger.error(`Document does not exist anymore: ${documentId}`);
      return;
    }

    const document = TanamDocument.fromFirestore(snap);

    if (document.status !== "published") {
      // This could happen if the document changed status while the task was in the queue
      logger.info("Document is no longer published. Stop here.");
      return;
    }

    const promises = [];

    // Copy document data to public collection
    promises.push(publicDocumentRef.set(document.data));

    // Copy associated files to public directory
    const [files] = await getStorage()
      .bucket()
      .getFiles({prefix: `tanam-documents/${documentId}/`});
    for (const file of files) {
      const publishedFileName = file.name.replace("tanam-documents/", "tanam-public/");
      promises.push(getStorage().bucket().file(file.name).copy(getStorage().bucket().file(publishedFileName)));
    }

    await Promise.all(promises);
  },
);

// Task to unpublish a document
// This task is responsible for removing the document from the public collection
// and deleting associated files from the cloud storage public directory.
export const taskUnpublishDocument = onTaskDispatched(
  {
    retryConfig: {
      maxAttempts: 3,
      minBackoffSeconds: 60,
    },
    rateLimits: {
      // Adjust for concurrency of documents in firestore
      maxDispatchesPerSecond: 1,
    },
  },
  async (req) => {
    const documentId = req.data.documentId;
    const publicDocumentRef = getFirestore().collection("tanam-public").doc(documentId);
    const documentRef = getFirestore().collection("tanam-documents").doc(documentId);
    const snap = await documentRef.get();

    const document = TanamDocument.fromFirestore(snap);

    if (document.status === "published") {
      // This could happen if the document changed status while the task was in the queue
      logger.info("Document is in status published. Stop here.");
      return;
    }

    // Remove document from public collection
    const promises = [publicDocumentRef.delete()];

    // Delete associated files from public directory
    const [files] = await getStorage()
      .bucket()
      .getFiles({prefix: `tanam-public/${documentId}/`});
    for (const file of files) {
      promises.push(getStorage().bucket().file(file.name).delete().then());
    }

    await Promise.all(promises);
  },
);

/**
 * Normalize a date to a maximum offset from now
 *
 * @param {Date} date A date to normalize
 * @param {number} hours Optional. Default is 720 hours (30 days)
 * @return {Date} The normalized date
 */
function normalizeDateToMaxOffset(date: Date, hours = 720): Date {
  const now = new Date();
  const maxDate = new Date(now.getTime() + hours * 60 * 60 * 1000);

  return date > maxDate ? maxDate : date;
}
