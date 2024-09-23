import {TanamDocumentTypeBase, LocalizedString} from "@tanam/domain-shared";
import {DocumentSnapshot, FieldValue, serverTimestamp, Timestamp} from "firebase/firestore";

export class TanamDocumentType extends TanamDocumentTypeBase<Timestamp, FieldValue> {
  protected getServerTimestamp(): FieldValue {
    return serverTimestamp();
  }

  static fromFirestore(snap: DocumentSnapshot): TanamDocumentType {
    const data = snap.data();
    if (!data) {
      throw new Error("Document data is undefined");
    }

    return new TanamDocumentType(
      snap.id,
      new LocalizedString(data.titleSingular),
      new LocalizedString(data.titlePlural),
      new LocalizedString(data.description),
      data.titleField,
      !!data.isEnabled,
      data.createdAt,
      data.updatedAt,
    );
  }
}
