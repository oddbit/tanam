import { DocumentType } from "../models";
import { AdminTanamDocumentType } from "../models/cloud-functions.models";
import * as admin from "firebase-admin";

export async function getDocumentTypes(tanamSiteId: string): Promise<AdminTanamDocumentType[]> {
  const result = await admin.firestore().collection('tanam').doc(tanamSiteId).collection('document-types').get();
  return result.docs.map(doc => new AdminTanamDocumentType(doc.data() as DocumentType));
}
