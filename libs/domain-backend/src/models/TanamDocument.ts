import {TanamDocumentBase} from "@tanam/domain-shared";
import {FieldValue, Timestamp} from "firebase-admin/firestore";
import {DocumentSnapshot} from "firebase-functions/v2/firestore";

export class TanamDocument extends TanamDocumentBase<Timestamp, FieldValue> {
  protected getServerTimestamp(): FieldValue {
    return FieldValue.serverTimestamp();
  }

  static fromFirestore(snap: DocumentSnapshot): TanamDocument {
    const data = snap.data();
    if (!data) {
      throw new Error("Document data is undefined");
    }

    return new TanamDocument(
      snap.id,
      data.createdAt,
      data.updatedAt,
      data.data,
      data.documentType,
      data.revision,
      data.publishedAt,
    );
  }
}
