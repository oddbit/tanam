export type TanamRole = "publisher" | "admin";

export interface ITanamUser<TimestampType> {
  role?: TanamRole;
  name?: string;
  createdAt: TimestampType;
  updatedAt: TimestampType;
}

export abstract class TanamUser<TimestampType, FieldValueType> {
  constructor(id: string, json: ITanamUser<TimestampType>) {
    this.id = id;
    this.name = json.name;
    this.role = json.role ?? "publisher";
    this.createdAt = json.createdAt;
    this.updatedAt = json.updatedAt;
  }

  public readonly id: string;
  public role: TanamRole;
  public name?: string;
  public readonly createdAt: TimestampType;
  public readonly updatedAt: TimestampType;

  protected abstract getServerTimestamp(): FieldValueType;

  toJson(): object {
    return {
      role: this.role,
      name: this.name,
      createdAt: this.createdAt ?? this.getServerTimestamp(),
      updatedAt: this.getServerTimestamp(),
    };
  }
}
