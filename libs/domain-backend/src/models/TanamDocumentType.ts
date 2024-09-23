import {LocalizedString, TanamDocumentTypeBase} from "@tanam/domain-shared";
import {FieldValue, Timestamp} from "firebase-admin/firestore";
import {DocumentSnapshot} from "firebase-functions/v2/firestore";

export class TanamDocumentType extends TanamDocumentTypeBase<Timestamp, FieldValue> {
  protected getServerTimestamp(): FieldValue {
    return FieldValue.serverTimestamp();
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
