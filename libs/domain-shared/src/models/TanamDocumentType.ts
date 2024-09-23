import {LocalizedString} from "./LocalizedString";

export abstract class TanamDocumentTypeBase<TimestampType, FieldValueType> {
  constructor(
    public readonly id: string,
    public titleSingular: LocalizedString,
    public titlePlural: LocalizedString,
    public description: LocalizedString,
    public titleField: string,
    public isEnabled = true,
    public readonly createdAt?: TimestampType,
    public readonly updatedAt?: TimestampType,
  ) {}

  protected abstract getServerTimestamp(): FieldValueType;

  toJson(): object {
    return {
      titleSingular: this.titleSingular.toJson(),
      titlePlural: this.titlePlural.toJson(),
      description: this.description.toJson(),
      titleField: this.titleField,
      isEnabled: !!this.isEnabled,
      createdAt: this.createdAt ?? this.getServerTimestamp(),
      updatedAt: this.getServerTimestamp(),
    };
  }
}
