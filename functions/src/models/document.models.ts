import { ITanamBase, TanamBase } from './base';

export type DocumentStatus = 'published' | 'unpublished' | 'scheduled';

export interface ITanamDocument extends ITanamBase {
  documentType: string;
  data: { [key: string]: any }; // The content data to render into templates
  title: string;  // Presentation title for browser window title and content listings
  url: string;
  canonicalUrl?: string;
  revision: number | any; // firebase.firestore.FieldValue.increment;
  status: DocumentStatus;
  tags: string[];
  standalone: boolean;
  dependencies: string[] | any; // Array of ids for documents that are referred to by this document
  rendered?: any; // firebase.firestore.Timestamp | firebase.firestore.FieldValue.serverTimestamp;
  published?: any; // firebase.firestore.Timestamp | firebase.firestore.FieldValue.serverTimestamp;
}

export class TanamDocument extends TanamBase implements ITanamDocument {
  documentType: string;
  data: { [key: string]: any };
  title: string;
  url: string;
  canonicalUrl: string;
  revision: number | any;
  tags: string[];
  standalone: boolean;
  dependencies: string[] | any;
  rendered: any;
  published: any;

  constructor(json: ITanamDocument) {
    super(json);
    this.documentType = json.documentType;
    this.data = !!json.data ? { ...json.data } : {};
    this.title = json.title || '';
    this.url = !!json.url ? TanamDocument._normalizeUrl(json.url) : '/';
    this.canonicalUrl = !!json.canonicalUrl
      ? TanamDocument._normalizeUrl(json.canonicalUrl)
      : null;
    this.revision = json.revision || 0;
    this.tags = !!json.tags ? json.tags.slice() : [];
    this.standalone = json.standalone === true;
    this.dependencies = !!json.dependencies ? json.dependencies.slice() : [];
    this.rendered = !!json.rendered && !!json.rendered.toDate
      ? json.rendered.toDate()
      : json.rendered;
    this.published = !!json.published && !!json.published.toDate
      ? json.published.toDate()
      : json.published;
  }

  get status() {
    if (!this.published) {
      return 'unpublished';
    } else if (this.published > Date.now()) {
      return 'scheduled';
    } else {
      return 'published';
    }
  }

  toJson(): ITanamDocument {
    return {
      ...super.toJson(),
      documentType: this.documentType,
      data: TanamDocument._normalizeData(this.data),
      title: this.title,
      url: TanamDocument._normalizeUrl(this.url),
      canonicalUrl: !!this.canonicalUrl
        ? TanamDocument._normalizeUrl(this.canonicalUrl)
        : null,
      revision: this.revision,
      status: this.status,
      tags: this.tags,
      standalone: this.standalone === true,
      dependencies: this.dependencies,
      rendered: this.rendered || null,
      published: this.published || null,
    } as ITanamDocument;
  }

  private static _normalizeUrl(url: string): string {
    return `/${url}`.replace(/\/+/g, '/');
  }

  private static _normalizeData(data: any): any {
    if (!data) {
      return {};
    }

    const result = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        result[key] = data[key] === undefined ? null : data[key];
      }
    }

    return result;
  }
}
