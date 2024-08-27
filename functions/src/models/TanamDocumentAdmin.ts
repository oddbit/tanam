import {FieldValue, Timestamp} from "firebase-admin/firestore";
import {DocumentSnapshot} from "firebase-functions/v2/firestore";
import {ITanamDocument, TanamDocument} from "tanam-shared/models/TanamDocument";

export class TanamDocumentAdmin extends TanamDocument<Timestamp, FieldValue> {
  constructor(id: string, json: ITanamDocument<Timestamp>) {
    super(id, json);
  }

  getServerTimestamp(): FieldValue {
    return FieldValue.serverTimestamp();
  }

  static fromFirestore(snap: DocumentSnapshot): TanamDocumentAdmin {
    const data = snap.data();
    if (!data) {
      throw new Error("Document data is undefined");
    }

    return new TanamDocumentAdmin(snap.id, {
      data: data.data,
      documentType: data.documentType,
      publishedAt: data.publishedAt,
      revision: data.revision,
      createdAt: data.createdAt || Timestamp.now(),
      updatedAt: data.updatedAt || Timestamp.now(),
    });
  }
}
