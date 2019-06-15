
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
