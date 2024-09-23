export type TanamRole = "publisher" | "admin";

export abstract class TanamUserBase<TimestampType, FieldValueType> {
  constructor(
    public readonly id: string,
    public readonly createdAt?: TimestampType,
    public readonly updatedAt?: TimestampType,
    public name?: string,
    public role: TanamRole = "publisher",
    public colorMode: "dark" | "light" = "light",
  ) {}

  protected abstract getServerTimestamp(): FieldValueType;

  toJson(): object {
    return {
      role: this.role,
      name: this.name,
      colorMode: this.colorMode,
      createdAt: this.createdAt ?? this.getServerTimestamp(),
      updatedAt: this.getServerTimestamp(),
    };
  }
}
