import {TanamDocumentData} from "./TanamDocumentData";

interface GenAiRequestTypeBase<TimestampType> {
  createdAt: TimestampType;
  updatedAt: TimestampType;
  data: TanamDocumentData;
  generatedDoc?: string;
  useCase: "article" | "event";
}

/**
 * Abstract class representing a GenAI Request.
 * This class encapsulates the common data structure and behavior for a request
 * to the GenAI service, which includes timestamps for creation and updates,
 * document data, the use case, and a generated document identifier.
 */
export abstract class GenAiRequest<TimestampType, FieldValueType> {
  public createdAt: TimestampType;
  public updatedAt: TimestampType;
  public data: TanamDocumentData;
  public generatedDoc?: string;
  public useCase: "article" | "event";

  constructor(json: GenAiRequestTypeBase<TimestampType>) {
    this.createdAt = json.createdAt;
    this.updatedAt = json.updatedAt;
    this.data = json.data;
    this.generatedDoc = json.generatedDoc;
    this.useCase = json.useCase;
  }

  protected abstract getServerTimestamp(): FieldValueType;

  toJson(): object {
    return {
      createdAt: this.createdAt ?? this.getServerTimestamp(),
      updatedAt: this.getServerTimestamp(),
      data: this.data,
      useCase: this.useCase,
      generatedDoc: this.generatedDoc,
    };
  }
}
