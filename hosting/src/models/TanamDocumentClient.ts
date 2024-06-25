import {TanamDocument, ITanamDocument} from "@functions/models/TanamDocument";
import {Timestamp, FieldValue, serverTimestamp, DocumentSnapshot} from "firebase/firestore";

export class TanamDocumentClient extends TanamDocument<Timestamp, FieldValue> {
  constructor(id: string, json: ITanamDocument<Timestamp>) {
    super(id, json);
  }

  getServerTimestamp(): FieldValue {
    return serverTimestamp();
  }

  static fromFirestore(snap: DocumentSnapshot): TanamDocumentClient {
    const data = snap.data();
    if (!data) {
      throw new Error("Document data is undefined");
    }

    return new TanamDocumentClient(snap.id, {
      data: data.data,
      documentType: data.documentType,
      publishedAt: data.publishedAt,
      revision: data.revision,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
