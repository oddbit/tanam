import {TanamUserBase} from "@tanam/domain-shared";
import {FieldValue, Timestamp} from "firebase-admin/firestore";
import {DocumentSnapshot} from "firebase-functions/v2/firestore";

export class TanamUser extends TanamUserBase<Timestamp, FieldValue> {
  protected getServerTimestamp(): FieldValue {
    return FieldValue.serverTimestamp();
  }

  static fromFirestore(snap: DocumentSnapshot): TanamUser {
    const data = snap.data();
    if (!data) {
      throw new Error("Document data is undefined");
    }

    return new TanamUser(
      snap.id,
      data.createdAt || Timestamp.now(),
      data.updatedAt || Timestamp.now(),
      data.name,
      data.role ?? "publisher",
      data.colorMode ?? "light",
    );
  }
}
