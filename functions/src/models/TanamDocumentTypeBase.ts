import { LocalizedString } from "@/models/LocalizedString";
import { TanamDocumentField } from "@/models/TanamDocumentField";

export interface ITanamDocumentType<TimestampType> {
  id: string;
  titleSingular: LocalizedString;
  titlePlural: LocalizedString;
  documentTitleField: string;
  fields: TanamDocumentField[];
  description: LocalizedString;
  createdAt: TimestampType;
  updatedAt: TimestampType;
}


export abstract class TanamDocumentTypeBase<TimestampType> {
  constructor(json: ITanamDocumentType<TimestampType>) {
    this.id = json.id;
    this.titleSingular = json.titleSingular;
    this.titlePlural = json.titlePlural;
    this.documentTitleField = json.documentTitleField;
    this.fields = json.fields;
    this.description = json.description;
    this.createdAt = json.createdAt;
    this.updatedAt = json.updatedAt;
  }

  public readonly id: string;
  public titleSingular: LocalizedString;
  public titlePlural: LocalizedString;
  public documentTitleField: string;
  public fields: TanamDocumentField[];
  public description: LocalizedString;
  public readonly createdAt: TimestampType;
  public readonly updatedAt: TimestampType;

  abstract getServerTimestamp(): TimestampType;

  toJson(): any {
    return {
      id: this.id,
      titleSingular: this.titleSingular,
      titlePlural: this.titlePlural,
      documentTitleField: this.documentTitleField,
      fields: this.fields.map((field) => field.toJson()),
      description: this.description.toJson(),
      createdAt: this.createdAt,
      updatedAt: this.getServerTimestamp(),
    };
  }
}
