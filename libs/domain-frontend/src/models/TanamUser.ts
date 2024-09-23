import {TanamUserBase} from "@tanam/domain-shared";
import {DocumentSnapshot, FieldValue, serverTimestamp, Timestamp} from "firebase/firestore";

export class TanamUser extends TanamUserBase<Timestamp, FieldValue> {
  protected getServerTimestamp(): FieldValue {
    return serverTimestamp();
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
