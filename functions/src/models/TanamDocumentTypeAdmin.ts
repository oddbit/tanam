import {
  TanamDocumentTypeBase,
  ITanamDocumentType,
} from "./TanamDocumentTypeBase";
import { Timestamp, FieldValue } from "firebase-admin/firestore";

export class TanamDocumentTypeAdmin extends TanamDocumentTypeBase<Timestamp> {
  constructor(json: ITanamDocumentType<Timestamp>) {
    super(json);
  }

  getServerTimestamp(): Timestamp {
    return FieldValue.serverTimestamp() as Timestamp;
  }
}
