export type TanamRole = "publisher" | "admin";

export interface ITanamUser<TimestampType> {
  role?: TanamRole;
  name?: string;
  darkMode: boolean;
  createdAt: TimestampType;
  updatedAt: TimestampType;
}

export abstract class TanamUser<TimestampType, FieldValueType> {
  constructor(id: string, json: ITanamUser<TimestampType>) {
    this.id = id;
    this.role = json.role ?? "publisher";
    this.name = json.name;
    this.darkMode = !!json.darkMode;
    this.createdAt = json.createdAt;
    this.updatedAt = json.updatedAt;
  }

  public readonly id: string;
  public role: TanamRole;
  public name?: string;
  public darkMode: boolean;
  public readonly createdAt: TimestampType;
  public readonly updatedAt: TimestampType;

  protected abstract getServerTimestamp(): FieldValueType;

  toJson(): object {
    return {
      role: this.role,
      name: this.name,
      darkMode: this.darkMode,
      createdAt: this.createdAt ?? this.getServerTimestamp(),
      updatedAt: this.getServerTimestamp(),
    };
  }
}
