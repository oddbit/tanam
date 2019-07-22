import { ITanamBase, TanamBase } from './base';

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

export interface ITanamDocumentField {
  key: string;
  title: string;
  isTitle?: boolean;
  type: DocumentFieldFormElement;
  documentType?: string;
  defaultValue?: any;
  validators: DocumentFieldValidator[];
}

export interface ITanamDocumentCount {
  published: number;
  unpublished: number;
  scheduled: number;
}

export interface ITanamDocumentType extends ITanamBase {
  title: string; // Presentation name
  slug: string; // Root slug to group entries by
  standalone: boolean; // True if the content can be presented on a page with URL of its own
  documentStatusDefault: 'published' | 'unpublished',
  description: string;
  icon: string; // Icon for menus etc
  fields: ITanamDocumentField[];
  documentCount: ITanamDocumentCount;
}

export interface DocumentTypeQueryOptions {
  limit?: number;
  orderBy?: {
    field: string,
    sortOrder: 'asc' | 'desc',
  };
  startAfter?: any; // firebase.firestore.DocumentSnapshot
}

export class TanamDocumentType extends TanamBase implements ITanamDocumentType {
  title: string;
  slug: string;
  standalone: boolean;
  documentStatusDefault: 'published' | 'unpublished';
  description: string;
  icon: string;
  fields: ITanamDocumentField[];
  documentCount: ITanamDocumentCount;

  constructor(json: ITanamDocumentType) {
    super(json);
    this.title = json.title;
    this.slug = json.slug || '/';
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
      } as ITanamDocumentCount;
  }

  static withTitle(title: string): TanamDocumentType {
    const id = title.replace(/[^A-Za-z0-9_-]/g, '');
    return new TanamDocumentType({
      id: id,
      title: title,
      slug: id,
    } as ITanamDocumentType);
  }

  toJson(): ITanamDocumentType {
    return {
      ...super.toJson(),
      title: this.title || this.id,
      slug: this.slug || '/',
      standalone: this.standalone,
      documentStatusDefault: this.documentStatusDefault,
      description: this.description || null,
      icon: this.icon || null,
      fields: this.fields.slice(),
      documentCount: {...this.documentCount},
    } as ITanamDocumentType;
  }

  toString() {
    return `${TanamDocumentType.name}(${this.id})`;
  }
}
