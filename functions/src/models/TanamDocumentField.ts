import {FieldType} from './../definitions/FieldType';
import {LocalizedString, Translations} from "./LocalizedString";

export interface ITanamDocumentField {
  weight: number;
  title: LocalizedString;
  description: LocalizedString;
  type: FieldType | string;
  validators: string[] | null;
}

/**
 * Tanam document field model.
 */
export class TanamDocumentField {
  /**
   * Constructor.
   *
   * @param {string} id Field ID
   * @param {ITanamDocumentField} json JSON representation of the field
   */
  constructor(id: string, json: ITanamDocumentField) {
    this.id = id;
    this.weight = json.weight;
    this.title = new LocalizedString(json.title as Translations) ?? json.title;
    this.description = json.description;
    this.type = json.type;
    this.validators = json.validators;
  }

  public id: string;
  public weight: number;
  public title: LocalizedString;
  public description: LocalizedString;
  public readonly type: FieldType | string;
  public readonly validators: string[] | null;

  /**
   * Serialize to JSON for Firestore.
   *
   * @return {any} JSON representation of the document field
   */
  toJson(): object {
    return {
      weight: this.weight,
      title: this.title.toJson(),
      description: this.description.toJson(),
      type: this.type,
      validators: this.validators,
    };
  }
}
