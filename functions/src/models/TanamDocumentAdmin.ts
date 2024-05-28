import { TanamDocumentBase, ITanamDocumentBase } from "./TanamDocumentBase";
import { Timestamp, FieldValue } from "firebase-admin/firestore";

export class TanamDocumentAdmin extends TanamDocumentBase<
  Timestamp,
  FieldValue
> {
  constructor(json: ITanamDocumentBase<Timestamp>) {
    super(json);
  }

  getServerTimestamp(): FieldValue {
    return FieldValue.serverTimestamp();
  }

  static fromJson(json: any): TanamDocumentAdmin {
    return new TanamDocumentAdmin({
      id: json.id,
      data: json.data,
      documentType: json.documentType,
      publishedAt: json.publishedAt || json.published,
      revision: json.revision,
      status: json.status,
      createdAt: json.createdAt || json.created,
      updatedAt: json.updatedAt || json.updated,
    });
  }
}
