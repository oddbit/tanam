import {TanamPublishStatus} from "./../definitions/TanamPublishStatus";
import {TanamDocumentData} from "./TanamDocumentData";

export abstract class TanamDocumentBase<TimestampType, FieldValueType> {
  public status: TanamPublishStatus;

  constructor(
    public readonly id: string,
    public readonly createdAt?: TimestampType,
    public readonly updatedAt?: TimestampType,
    public documentType = "unknown",
    public data: TanamDocumentData = {},
    public revision = 0,
    public publishedAt?: TimestampType,
  ) {
    // The status of the document is determined by the publishedAt field
    this.status = this.publishedAt ? TanamPublishStatus.Published : TanamPublishStatus.Unpublished;
  }

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
