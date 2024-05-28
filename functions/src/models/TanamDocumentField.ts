import { LocalizedString } from "./LocalizedString";

interface ITanamDocumentField {
  key: string;
  title: LocalizedString;
  type: string;
  validators: string[] | null;
}

/**
 * Tanam document field model.
 */
export class TanamDocumentField {
  /**
   * Constructor.
   *
   * @param {ITanamDocumentField} json JSON representation of the field
   */
  constructor(json: ITanamDocumentField) {
    this.key = json.key;
    this.title = json.title;
    this.type = json.type;
    this.validators = json.validators;
  }

  public readonly key: string;
  public readonly title: LocalizedString;
  public readonly type: string;
  public readonly validators: string[] | null;

  /**
   * Static factory constructor.
   *
   * @param {any} json JSON representation of the field
   * @return {TanamDocumentField} Document field instance
   */
  static fromJson(json: any): TanamDocumentField {
    return new TanamDocumentField({
      key: json.key,
      title: new LocalizedString(json.title), // Assuming LocalizedString has a constructor that accepts JSON
      type: json.type,
      validators: json.validators,
    });
  }

  /**
   * Serialize to JSON for Firestore.
   *
   * @return {any} JSON representation of the document field
   */
  toJson(): any {
    return {
      key: this.key,
      title: this.title.toJson(),
      type: this.type,
      validators: this.validators,
    };
  }
}
