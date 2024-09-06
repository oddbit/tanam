import {ITanamUser, TanamUser} from "@tanam/shared";
import {DocumentSnapshot, FieldValue, serverTimestamp, Timestamp} from "firebase/firestore";

export class TanamUserClient extends TanamUser<Timestamp, FieldValue> {
  constructor(id: string, json: ITanamUser<Timestamp>) {
    super(id, json);
  }

  getServerTimestamp(): FieldValue {
    return serverTimestamp();
  }

  static fromFirestore(snap: DocumentSnapshot): TanamUserClient {
    const data = snap.data();
    if (!data) {
      throw new Error("Document data is undefined");
    }

    return new TanamUserClient(snap.id, {
      role: data.role,
      name: data.name,
      colorMode: data.colorMode,
      createdAt: data.createdAt || Timestamp.now(),
      updatedAt: data.updatedAt || Timestamp.now(),
    });
  }
}
