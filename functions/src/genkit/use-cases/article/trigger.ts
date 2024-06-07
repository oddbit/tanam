import {getFirestore} from "firebase-admin/firestore";
import {onDocumentWritten} from "firebase-functions/v2/firestore";

const db = getFirestore();

export const onTanamGenaiWrite = onDocumentWritten("/tanam-genai/{documentId}", async (event) => {
  const afterData = event.data?.after.exists ? event.data.after.data() : null;
  const documentId = event.params.documentId;
  if (!afterData) {
    console.log("Document deleted. Nothing to do.");
    return;
  } 
    

  // Example operation: Update a field in the same document
  if (afterData) {
    try {
      await db.collection("tanam-genai").doc(documentId).update({
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`Document ${documentId} updated with timestamp`);
    } catch (error) {
      console.error(`Error updating document ${documentId}:`, error);
    }
  }

  return;
});
