import {Timestamp, WriteResult, getFirestore} from "firebase-admin/firestore";
import {logger} from "firebase-functions/v2";
import {onValueCreated} from "firebase-functions/v2/database";
import {ITanamDocument} from "../models/TanamDocument";
import {TanamDocumentAdmin} from "../models/TanamDocumentAdmin";
import {generateArticleLlm} from "./use-cases";
import {InputSchemaArticle} from "./use-cases/article/schemas";

const db = getFirestore();

/**
 * Realtime Database trigger that runs when a new node is added in the /tanam-genai/{requestId} path.
 *
 * This function processes the created node, generates content based on the specified use case,
 * and stores the generated content in a new Firestore document. It also updates the original request
 * node with the ID of the generated document.
 */
export const onGenaiRequest = onValueCreated("tanam-genai/{type}", async (event) => {
  const promises: Promise<void | WriteResult>[] = [event.data.ref.remove()];
  const genAiRequestData = event.data.val();
  const documenType = event.params.type;
  if (!genAiRequestData) {
    throw new Error("Node data is undefined");
  }

  const requestRef = event.data.ref;
  if (!requestRef) {
    throw new Error("Node reference is undefined");
  }

  const documentData: ITanamDocument<Timestamp> = {
    data: {},
    documentType: documenType,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  logger.info(`Received GenAI request: ${documenType}`, genAiRequestData);
  if (documenType === "article") {
    documentData.data = await generateArticleLlm(InputSchemaArticle.parse(genAiRequestData));
  } else {
    throw new Error(`Unknown use case: ${genAiRequestData.useCase}`);
  }
  const docRef = db.collection("tanam-documents").doc();
  const newDocId = docRef.id;
  const tanamDocument = new TanamDocumentAdmin(newDocId, documentData);
  promises.push(docRef.set(tanamDocument.toJson()));

  logger.info(`Generating document: ${newDocId}`, tanamDocument.toJson());

  return Promise.all(promises);
});
