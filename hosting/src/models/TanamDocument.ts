import {FieldValue, Timestamp, serverTimestamp} from "firebase/firestore";

interface DocumentData {
  [key: string]: any;
}

/**
 * Tanam document model.
 */
export class TanamDocument {
  /**
   * Constructor.
   *
   * @param {string} id Document ID
   * @param {string | null} canonicalUrl Canonical URL of the document
   * @param {DocumentData} data Data of the document
   * @param {string} documentType Type of the document
   * @param {Timestamp} publishedAt Date when the document was published
   * @param {number} revision Revision number of the document
   * @param {boolean} standalone Whether the document is standalone
   * @param {string} status Status of the document
   * @param {Tags} tags Tags associated with the document
   * @param {Timestamp} createdAt Date when the document was created
   * @param {Timestamp} updatedAt Date when the document was last updated
   */
  constructor(
    public readonly id: string,
    public canonicalUrl: string | null,
    public data: DocumentData,
    public documentType: string,
    public publishedAt: Timestamp,
    public revision: number,
    public standalone: boolean,
    public status: string,
    public tags: string[],
    public readonly createdAt: Timestamp,
    public readonly updatedAt: Timestamp,
  ) {}

  /**
   * Static factory constructor.
   *
   * @param {any} json JSON representation of the document
   * @return {TanamDocument} Document instance
   */
  static fromJson(json: any): TanamDocument {
    return new TanamDocument(
      json.id,
      json.canonicalUrl,
      json.data,
      json.documentType,
      json.publishedAt || json.published,
      json.revision,
      json.standalone,
      json.status,
      json.tags,
      json.createdAt || json.created,
      json.updatedAt || json.updated,
    );
  }

  /**
   * Serialize to JSON for Firestore.
   *
   * @return {any} JSON representation of the document
   */
  toJson(): any {
    return {
      canonicalUrl: this.canonicalUrl,
      data: this.data,
      documentType: this.documentType,
      publishedAt: this.publishedAt,
      revision: this.revision,
      standalone: this.standalone,
      status: this.status,
      tags: this.tags,
      createdAt: this.createdAt,
      updatedAt: serverTimestamp() as FieldValue,
    };
  }
}
