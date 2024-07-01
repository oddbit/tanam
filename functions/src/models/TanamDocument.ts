interface DocumentData {
  [key: string]: unknown;
}

export type TanamPublishStatus = "published" | "unpublished" | "scheduled";

export interface ITanamDocument<TimestampType> {
  data: DocumentData;
  documentType: string;
  revision?: number;
  publishedAt?: TimestampType;
  createdAt: TimestampType;
  updatedAt: TimestampType;
}

export abstract class TanamDocument<TimestampType, FieldValueType> {
  constructor(id: string, json: ITanamDocument<TimestampType>) {
    this.id = id;
    this.data = json.data ?? {};
    this.documentType = json.documentType ?? "unknown";
    this.publishedAt = json.publishedAt;
    this.revision = json.revision ?? 0;
    this.createdAt = json.createdAt;
    this.updatedAt = json.updatedAt;
  }

  public readonly id: string;
  public data: DocumentData;
  public documentType: string;
  public publishedAt?: TimestampType;
  public revision: number;
  public readonly createdAt: TimestampType;
  public readonly updatedAt: TimestampType;

  abstract get status(): TanamPublishStatus;
  protected abstract getServerTimestamp(): FieldValueType;

  toJson(): object {
    return {
      data: this.data,
      documentType: this.documentType,
      revision: this.revision,
      status: this.status,
      publishedAt: this.publishedAt || null,
      createdAt: this.createdAt ?? this.getServerTimestamp(),
      updatedAt: this.getServerTimestamp(),
    };
  }
}
