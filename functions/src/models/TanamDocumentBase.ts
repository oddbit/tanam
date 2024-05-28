// tanamDocumentBase.ts
interface DocumentData {
  [key: string]: any;
}

export interface ITanamDocumentBase<TimestampType> {
  id: string;
  data: DocumentData;
  documentType: string;
  publishedAt: TimestampType;
  revision: number;
  status: string;
  createdAt: TimestampType;
  updatedAt: TimestampType;
}

export abstract class TanamDocumentBase<TimestampType, FieldValueType> {
  constructor(json: ITanamDocumentBase<TimestampType>) {
    this.id = json.id;
    this.data = json.data;
    this.documentType = json.documentType;
    this.publishedAt = json.publishedAt;
    this.revision = json.revision;
    this.status = json.status;
    this.createdAt = json.createdAt;
    this.updatedAt = json.updatedAt;
  }

  public readonly id: string;
  public data: DocumentData;
  public documentType: string;
  public publishedAt: TimestampType;
  public revision: number;
  public status: string;
  public readonly createdAt: TimestampType;
  public readonly updatedAt: TimestampType;

  abstract getServerTimestamp(): FieldValueType;

  toJson(): any {
    return {
      data: this.data,
      documentType: this.documentType,
      published: this.publishedAt,
      revision: this.revision,
      status: this.status,
      created: this.createdAt,
      updated: this.getServerTimestamp(),
    };
  }
}
