import {FieldValue, Timestamp} from "firebase-admin/firestore";
import {ITanamDocument, TanamDocument, TanamPublishStatus} from "./TanamDocument";
import {DocumentSnapshot} from "firebase-functions/v2/firestore";

export class TanamDocumentAdmin extends TanamDocument<Timestamp, FieldValue> {
  constructor(id: string, json: ITanamDocument<Timestamp>) {
    super(id, json);
  }

  get status(): TanamPublishStatus {
    if (!this.publishedAt) {
      return "unpublished";
    } else if (this.publishedAt.toMillis() > Timestamp.now().toMillis()) {
      return "scheduled";
    } else {
      return "published";
    }
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
