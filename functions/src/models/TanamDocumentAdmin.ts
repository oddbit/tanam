import {FieldValue, Timestamp} from "firebase-admin/firestore";
import {ITanamDocument, TanamDocumentBase} from "./TanamDocumentBase";

export class TanamDocumentAdmin extends TanamDocumentBase<Timestamp, FieldValue> {
  constructor(id: string, json: ITanamDocument<Timestamp>) {
    super(id, json);
  }

  getServerTimestamp(): FieldValue {
    return FieldValue.serverTimestamp();
  }
}
