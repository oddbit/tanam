import {TanamSite, ITanamSite} from "@functions/models/TanamSite";
import {Timestamp, FieldValue, serverTimestamp, DocumentSnapshot} from "firebase/firestore";

export class TanamSiteClient extends TanamSite<Timestamp, FieldValue> {
  constructor(id: string, json: ITanamSite<Timestamp>) {
    super(id, json);
  }

  getServerTimestamp(): FieldValue {
    return serverTimestamp();
  }

  static fromFirestore(snap: DocumentSnapshot): TanamSiteClient {
    const data = snap.data();
    if (!data) {
      throw new Error("Document data is undefined");
    }

    return new TanamSiteClient(snap.id, {
      title: data.title,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
