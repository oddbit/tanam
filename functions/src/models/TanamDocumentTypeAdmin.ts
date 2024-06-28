import {DocumentSnapshot} from "firebase-functions/v2/firestore";
import {LocalizedString} from "./LocalizedString";
import {TanamDocumentType, ITanamDocumentType} from "./TanamDocumentType";
import {Timestamp, FieldValue} from "firebase-admin/firestore";

export class TanamDocumentTypeAdmin extends TanamDocumentType<Timestamp, FieldValue> {
  constructor(id: string, json: ITanamDocumentType<Timestamp>) {
    super(id, json);
  }

  getServerTimestamp(): FieldValue {
    return FieldValue.serverTimestamp();
  }
  static fromFirestore(snap: DocumentSnapshot): TanamDocumentTypeAdmin {
    const data = snap.data();
    if (!data) {
      throw new Error("Document data is undefined");
    }
    return new TanamDocumentTypeAdmin(snap.id, {
      titleSingular: new LocalizedString(data.titleSingular),
      titlePlural: new LocalizedString(data.titlePlural),
      description: new LocalizedString(data.description),
      titleField: data.documentTitleField,
      isEnabled: data.isEnabled,
      createdAt: data.createdAt || Timestamp.now(),
      updatedAt: data.updatedAt || Timestamp.now(),
    });
  }
}
