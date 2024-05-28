import {FieldValue, Timestamp} from "firebase-admin/firestore";
import {ITanamSite, TanamSiteBase} from "./TanamSiteBase";

export class TanamSiteAdmin extends TanamSiteBase<Timestamp, FieldValue> {
  constructor(id: string, json: ITanamSite<Timestamp>) {
    super(id, json);
  }

  getServerTimestamp(): FieldValue {
    return FieldValue.serverTimestamp();
  }
}
