import {LocalizedString} from "./LocalizedString";

export interface ITanamDocumentType<TimestampType> {
  titleSingular: LocalizedString;
  titlePlural: LocalizedString;
  description: LocalizedString;
  titleField: string;
  isEnabled: boolean;
  createdAt: TimestampType;
  updatedAt: TimestampType;
}

export abstract class TanamDocumentType<TimestampType, FieldValueType> {
  constructor(id: string, json: ITanamDocumentType<TimestampType>) {
    this.id = id;
    this.titleSingular = json.titleSingular;
    this.description = json.description;
    this.titlePlural = json.titlePlural;
    this.titleField = json.titleField;
    this.isEnabled = !!json.isEnabled;
    this.createdAt = json.createdAt;
    this.updatedAt = json.updatedAt;
  }

  public readonly id: string;
  public titleSingular: LocalizedString;
  public titlePlural: LocalizedString;
  public description: LocalizedString;
  public titleField: string;
  public isEnabled: boolean;
  public readonly createdAt: TimestampType;
  public readonly updatedAt: TimestampType;

  protected abstract getServerTimestamp(): FieldValueType;

  toJson(): object {
    return {
      titleSingular: this.titleSingular.toJson(),
      titlePlural: this.titlePlural.toJson(),
      description: this.description.toJson(),
      titleField: this.titleField,
      isEnabled: !!this.isEnabled,
      createdAt: this.createdAt,
      updatedAt: this.getServerTimestamp(),
    };
  }
}
