
export type DocumentFieldFormElement = 'input-text'
  | 'input-number'
  | 'textbox-plain'
  | 'textbox-rich'
  | 'image'
  | 'document-reference'
  | 'date'
  | 'date-time'
  | 'slide-toggle';

export type DocumentFieldValidator = 'required';

export interface DocumentField {
  key: string;
  title: string;
  isTitle?: boolean;
  type: DocumentFieldFormElement;
  documentType?: string;
  defaultValue?: any;
  validators: DocumentFieldValidator[];
}

export interface DocumentCount {
  published: number;
  unpublished: number;
  scheduled: number;
}

export interface DocumentType {
  id: string; // Document id
  title: string; // Presentation name
  slug: string; // Root slug to group entries by
  standalone: boolean; // True if the content can be presented on a page with URL of its own
  documentStatusDefault: 'published' | 'unpublished',
  description: string;
  icon: string; // Icon for menus etc
  fields: DocumentField[];
  documentCount: DocumentCount;
  updated: any; // firebase.firestore.Timestamp | firebase.firestore.FieldValue
  created: any; // firebase.firestore.Timestamp | firebase.firestore.FieldValue
}

export interface DocumentTypeQueryOptions {
  limit?: number;
  orderBy?: {
    field: string,
    sortOrder: 'asc' | 'desc',
  };
  startAfter?: any; // firebase.firestore.DocumentSnapshot
}

export class TanamDocumentType implements DocumentType {
  id: string;
  title: string;
  slug: string;
  standalone: boolean;
  documentStatusDefault: 'published' | 'unpublished';
  description: string;
  icon: string;
  fields: DocumentField[];
  documentCount: DocumentCount;
  updated: any;
  created: any;

  constructor(json: DocumentType) {
    this.id = json.id;
    this.title = json.title;
    this.slug = json.slug;
    this.standalone = json.standalone === true;
    this.documentStatusDefault = json.documentStatusDefault || 'published';
    this.description = json.description;
    this.icon = json.icon || 'insert_drive_file';
    this.fields = !!json.fields ? json.fields.slice() : [];
    this.documentCount = !!json.documentCount
      ? { ...json.documentCount }
      : {
        published: 0,
        unpublished: 0,
        scheduled: 0,
      } as DocumentCount;
    this.updated = json.updated;
    this.created = json.created;
  }

  static withTitle(title: string): TanamDocumentType {
    const id = title.replace(/[^A-Za-z0-9_-]/g, '');
    return new TanamDocumentType({
      id: id,
      title: title,
      slug: id,
    } as DocumentType);
  }

  toJson(): DocumentType {
    return {
      id: this.id,
      title: this.title || this.id,
      slug: this.slug || this.id,
      standalone: this.standalone,
      documentStatusDefault: this.documentStatusDefault,
      description: this.description || null,
      icon: this.icon || null,
      fields: this.fields.slice(),
      documentCount: {...this.documentCount},
      updated: this.updated || null,
      created: this.created || null,
    } as DocumentType;
  }

  toString() {
    return `${TanamDocumentType.name}(${this.id})`;
  }
}
