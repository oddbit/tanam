import {FieldValue, Timestamp} from "firebase-admin/firestore";
import {DocumentSnapshot} from "firebase-functions/v2/firestore";
import {ITanamUser, TanamUser} from "./TanamUser";

export class TanamUserAdmin extends TanamUser<Timestamp, FieldValue> {
  constructor(id: string, json: ITanamUser<Timestamp>) {
    super(id, json);
  }

  getServerTimestamp(): FieldValue {
    return FieldValue.serverTimestamp();
  }

  static fromFirestore(snap: DocumentSnapshot): TanamUserAdmin {
    const data = snap.data();
    if (!data) {
      throw new Error("Document data is undefined");
    }

    return new TanamUserAdmin(snap.id, {
      role: data.role,
      createdAt: data.createdAt || Timestamp.now(),
      updatedAt: data.updatedAt || Timestamp.now(),
    });
  }
}
