export interface ITanamSite<TimestampType> {
  title: string;
  createdAt: TimestampType;
  updatedAt: TimestampType;
}

export abstract class TanamSite<TimestampType, FieldValueType> {
  constructor(id: string, json: ITanamSite<TimestampType>) {
    this.id = id;
    this.title = json.title;
    this.createdAt = json.createdAt;
    this.updatedAt = json.updatedAt;
  }

  public readonly id: string;
  public readonly title: string;
  public readonly createdAt: TimestampType;
  public readonly updatedAt: TimestampType;

  protected abstract getServerTimestamp(): FieldValueType;

  toJson(): object {
    return {
      title: this.title,
      createdAt: this.createdAt,
      updatedAt: this.getServerTimestamp(),
    };
  }
}
