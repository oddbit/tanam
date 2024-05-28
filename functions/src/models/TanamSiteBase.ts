export interface ITanamSite<TimestampType> {
  title: string;
  analytics: string;
  createdAt: TimestampType;
  updatedAt: TimestampType;
}

export abstract class TanamSiteBase<TimestampType, FieldValueType> {
  constructor(id: string, json: ITanamSite<TimestampType>) {
    this.id = id;
    this.title = json.title;
    this.analytics = json.analytics;
    this.createdAt = json.createdAt;
    this.updatedAt = json.updatedAt;
  }

  public readonly id: string;
  public readonly title: string;
  public readonly analytics: string;
  public readonly createdAt: TimestampType;
  public readonly updatedAt: TimestampType;

  protected abstract getServerTimestamp(): FieldValueType;

  toJson(): object {
    return {
      title: this.title,
      analytics: this.analytics,
      createdAt: this.createdAt,
      updatedAt: this.getServerTimestamp(),
    };
  }
}
