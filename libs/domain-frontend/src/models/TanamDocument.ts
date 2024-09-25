import {TanamDocumentBase, TanamDocumentData} from "@tanam/domain-shared";
import {DocumentSnapshot, FieldValue, serverTimestamp, Timestamp} from "firebase/firestore";

export class TanamDocument extends TanamDocumentBase<Timestamp, FieldValue> {
  protected getServerTimestamp(): FieldValue {
    return serverTimestamp();
  }

  static new(id: string, documentType: string, data: TanamDocumentData): TanamDocument {
    return new TanamDocument(id, undefined, undefined, documentType, data);
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
      data.documentType,
      data.data,
      data.revision,
      data.publishedAt,
    );
  }
}
