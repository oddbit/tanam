import {FieldValue, Timestamp, getFirestore} from "firebase-admin/firestore";
import {logger} from "firebase-functions/v2";
import {onDocumentCreated} from "firebase-functions/v2/firestore";
import {GenAiRequestAdmin, GenAiRequestAdminSchema} from "../models/GenAiRequestAdmin";
import {ITanamDocument} from "../models/TanamDocument";
import {TanamDocumentAdmin} from "../models/TanamDocumentAdmin";
import {generateArticleLlm} from "./use-cases";
import {InputSchemaArticle} from "./use-cases/article/schemas";

const db = getFirestore();

/**
 * Firestore trigger that runs when a new document is created in the /tanam-genai/{documentId} path.
 *
 * This function processes the created document, generates content based on the specified use case,
 * and stores the generated content in a new Firestore document. It also updates the original request
 * document with the ID of the generated document.
 */
export const onGenaiRequest = onDocumentCreated("/tanam-genai/{documentId}", async (event) => {
  const newData = event.data?.data();
  if (!newData) {
    throw new Error("Document data is undefined");
  }

  const requestRef = event.data?.ref;
  if (!requestRef) {
    throw new Error("Document reference is undefined");
  }

  const genAiRequest = new GenAiRequestAdmin(GenAiRequestAdminSchema.parse(newData));
  const docRef = db.collection("tanam-documents").doc();
  const newDocId = docRef.id;
  const documentData: ITanamDocument<Timestamp> = {
    data: {},
    documentType: genAiRequest.useCase,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  logger.info(`Received GenAI request: ${genAiRequest.useCase}`);
  if (genAiRequest.useCase === "article") {
    documentData.data = await generateArticleLlm(InputSchemaArticle.parse(genAiRequest.data));
  } else if (genAiRequest.useCase === "event") {
    throw new Error("Event use case not implemented yet");
  } else {
    throw new Error(`Unknown use case: ${genAiRequest.useCase}`);
  }

  const tanamDocument = new TanamDocumentAdmin(newDocId, documentData);
  logger.info(`Generating document: ${newDocId}`, tanamDocument.toJson());

  const writeBatch = db.batch();
  writeBatch.set(docRef, tanamDocument.toJson());
  writeBatch.update(requestRef, {generatedDoc: newDocId, updatedAt: FieldValue.serverTimestamp()});

  return writeBatch.commit();
});
