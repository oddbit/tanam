/**
 * Tanam document type model.
 */
export class TanamDocumentType {
  /**
   * Constructor.
   *
   * @param {string} id document type ID
   * @param {string} title Document type title
   */
  constructor(
    public readonly id: string,
    public title: string,
  ) {}

  /**
   * Static factory constructor.
   *
   * @param {any} json JSON representation of the document type
   * @return {TanamDocumentType} Document type instance
   */
  static fromJson(json: any): TanamDocumentType {
    return new TanamDocumentType(json.id, json.title);
  }

  /**
   * Serialize to JSON for Firestore
   *
   * @return {any} JSON representation of the document type
   */
  toJson(): any {
    return {
      id: this.id,
      title: this.title,
    };
  }
}
