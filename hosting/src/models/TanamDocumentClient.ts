import {ITanamDocument, TanamDocument, TanamPublishStatus} from "@functions/models/TanamDocument";
import {DocumentSnapshot, FieldValue, serverTimestamp, Timestamp} from "firebase/firestore";

export class TanamDocumentClient extends TanamDocument<Timestamp, FieldValue> {
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
