/**
 * Tanam document field model.
 */
export class TanamDocumentField {
  /**
   * Constructor.
   *
   * @param {string} key The key of the field
   * @param {string} title The title of the field
   * @param {string} type The type of the field
   * @param {string[] | null} validators The validators for the field
   */
  constructor(
    public readonly key: string,
    public readonly title: string,
    public readonly type: string,
    public readonly validators: string[] | null,
  ) {}

  /**
   * Static factory constructor.
   *
   * @param {any} json JSON representation of the field
   * @return {TanamDocumentField} Document field instance
   */
  static fromJson(json: any): TanamDocumentField {
    return new TanamDocumentField(json.key, json.title, json.type, json.validators);
  }

  /**
   * Serialize to JSON for Firestore.
   *
   * @return {any} JSON representation of the document field
   */
  toJson(): any {
    return {
      key: this.key,
      title: this.title,
      type: this.type,
      validators: this.validators,
    };
  }
}
