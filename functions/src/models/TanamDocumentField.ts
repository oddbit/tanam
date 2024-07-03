import {FieldType} from './../definitions/FieldType';
import {LocalizedString} from "./LocalizedString";

export interface ITanamDocumentField {
  weight: number;
  title: LocalizedString;
  description: LocalizedString;
  type: string;
  fieldType: FieldType
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
    this.title = json.title;
    this.description = json.description;
    this.type = json.type;
    this.fieldType = json.fieldType;
    this.validators = json.validators;
  }

  public id: string;
  public weight: number;
  public title: LocalizedString;
  public fieldType: FieldType;
  public description: LocalizedString;
  public readonly type: string;
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
      fieldType: this.fieldType,
      description: this.description.toJson(),
      type: this.type,
      validators: this.validators,
    };
  }
}
