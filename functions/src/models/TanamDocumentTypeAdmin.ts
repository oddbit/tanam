import {TanamDocumentTypeBase, ITanamDocumentType} from "./TanamDocumentTypeBase";
import {Timestamp, FieldValue} from "firebase-admin/firestore";

export class TanamDocumentTypeAdmin extends TanamDocumentTypeBase<Timestamp, FieldValue> {
  constructor(id: string, json: ITanamDocumentType<Timestamp>) {
    super(id, json);
  }

  getServerTimestamp(): FieldValue {
    return FieldValue.serverTimestamp();
  }
}
