export class TanamDocumentType {
  constructor(
    public id: string,
    public title: string,
  ) {}

  static fromJson(json: any): TanamDocumentType {
    return new TanamDocumentType(json.id, json.title);
  }

  toJson(): any {
    return {
      id: this.id,
      title: this.title,
    };
  }
}
