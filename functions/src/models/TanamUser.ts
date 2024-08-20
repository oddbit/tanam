export type TanamRole = "publisher" | "admin";

export interface ITanamUser<TimestampType> {
  role?: TanamRole;
  name?: string;
  profilePicture?: string;
  colorMode: "dark" | "light";
  createdAt: TimestampType;
  updatedAt: TimestampType;
}

export abstract class TanamUser<TimestampType, FieldValueType> {
  constructor(id: string, json: ITanamUser<TimestampType>) {
    this.id = id;
    this.role = json.role ?? "publisher";
    this.name = json.name;
    this.profilePicture = json.profilePicture;
    this.colorMode = json.colorMode ?? "light";
    this.createdAt = json.createdAt;
    this.updatedAt = json.updatedAt;
  }

  public readonly id: string;
  public role: TanamRole;
  public name?: string;
  public profilePicture?: string;
  public colorMode: "dark" | "light";
  public readonly createdAt: TimestampType;
  public readonly updatedAt: TimestampType;

  protected abstract getServerTimestamp(): FieldValueType;

  toJson(): object {
    return {
      role: this.role,
      name: this.name,
      profilePicture: this.profilePicture,
      colorMode: this.colorMode,
      createdAt: this.createdAt ?? this.getServerTimestamp(),
      updatedAt: this.getServerTimestamp(),
    };
  }
}
