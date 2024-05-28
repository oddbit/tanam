import {FieldValue, Timestamp} from "firebase-admin/firestore";
import {ITanamSite, TanamSite} from "./TanamSite";
import {DocumentSnapshot} from "firebase-functions/v2/firestore";

export class TanamSiteAdmin extends TanamSite<Timestamp, FieldValue> {
  constructor(id: string, json: ITanamSite<Timestamp>) {
    super(id, json);
  }

  getServerTimestamp(): FieldValue {
    return FieldValue.serverTimestamp();
  }

  static fromFirestore(snap: DocumentSnapshot): TanamSiteAdmin {
    const data = snap.data();
    if (!data) {
      throw new Error("Document data is undefined");
    }

    return new TanamSiteAdmin(snap.id, {
      title: data.title,
      createdAt: data.createdAt || Timestamp.now(),
      updatedAt: data.updatedAt || Timestamp.now(),
    });
  }
}
