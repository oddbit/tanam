import {LocalizedString} from "@functions/models/LocalizedString";
import {ITanamDocumentType, TanamDocumentType} from "@functions/models/TanamDocumentType";
import {DocumentSnapshot, FieldValue, Timestamp, serverTimestamp} from "firebase/firestore";

export class TanamDocumentTypeClient extends TanamDocumentType<Timestamp, FieldValue> {
  constructor(id: string, json: ITanamDocumentType<Timestamp>) {
    super(id, json);
  }

  getServerTimestamp(): FieldValue {
    return serverTimestamp();
  }

  static fromFirestore(snap: DocumentSnapshot): TanamDocumentTypeClient {
    const data = snap.data();
    if (!data) {
      throw new Error("Document data is undefined");
    }

    return new TanamDocumentTypeClient(snap.id, {
      titleSingular: new LocalizedString(data.titleSingular),
      titlePlural: new LocalizedString(data.titlePlural),
      description: new LocalizedString(data.description),
      documentTitleField: data.documentTitleField,
      isEnabled: data.isEnabled,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
