import { FieldValue, Timestamp, serverTimestamp } from "firebase/firestore";

/**
 * Tanam site model
 */
export class TanamSite {
  /**
   *
   * @param {string} id Site ID
   * @param {string} title Site title
   * @param {string} analytics Google Analytics tracking ID
   * @param {Timestamp} createdAt Site creation date
   * @param Timestamp updatedAt Site last update date
   */
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly analytics: string,
    public readonly createdAt: Timestamp,
    public readonly updatedAt: Timestamp,
  ) {}

  static fromJson(json: any): TanamSite {
    return new TanamSite(
      json.id,
      json.title,
      json.analytics,
      json.created || json.createdAt,
      json.updated || json.updatedAt,
    );
  }

  toJson(): any {
    return {
      id: this.id,
      title: this.title,
      analytics: this.analytics,
      createdAt: this.createdAt,
      updatedAt: serverTimestamp() as FieldValue,
    };
  }
}
