import {TanamDocumentField} from "@/models/TanamDocumentField";

/**
 * Tanam document type model.
 */
export class TanamDocumentType {
  /**
   * Constructor.
   *
   * @param {string} id Document type ID
   * @param {string} titleSingular Document type title in singular
   * @param {string} titlePlural Document type title in plural
   * @param {string} documentTitleField The document data field to use as the title
   * @param {TanamDocumentField[]} fields Array of fields in the document type
   */
  constructor(
    public readonly id: string,
    public titleSingular: string,
    public titlePlural: string,
    public documentTitleField: string,
    public fields: TanamDocumentField[],
  ) {}

  /**
   * Static factory constructor.
   *
   * @param {any} json JSON representation of the document type
   * @return {TanamDocumentType} Document type instance
   */
  static fromJson(json: any): TanamDocumentType {
    const fields: TanamDocumentField[] = json.fields.map((field: any) => TanamDocumentField.fromJson(field));

    return new TanamDocumentType(
      json.id,
      json.titleSingular || json.title,
      json.titlePlural || json.title,
      json.documentTitleField,
      fields,
    );
  }

  /**
   * Serialize to JSON for Firestore.
   *
   * @return {any} JSON representation of the document type
   */
  toJson(): any {
    return {
      id: this.id,
      titleSingular: this.titleSingular,
      titlePlural: this.titlePlural,
      documentTitleField: this.documentTitleField,
      fields: this.fields.map((field) => field.toJson()),
    };
  }
}
