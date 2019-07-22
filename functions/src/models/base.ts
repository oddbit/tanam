export interface ITanamBase {
  id: string;
  created: Date | any;
  updated: Date | any;
}

export abstract class TanamBase implements ITanamBase {
  id: string;
  created: Date | any;
  updated: Date | any;

  protected constructor(json: ITanamBase) {
    this.id = json.id;
    this.created = !!json.created && !!json.created.toDate
      ? json.created.toDate()
      : json.created;
    this.updated = !!json.updated && !!json.updated.toDate
      ? json.updated.toDate()
      : json.updated;
  }

  toJson(): ITanamBase {
    return {
      id: this.id,
      created: this.created || null,
      updated: this.updated || null,
    } as ITanamBase;
  }

}
