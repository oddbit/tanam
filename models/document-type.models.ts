
export type DocumentFieldFormElement = 'input-text'
    | 'input-number'
    | 'textbox-plain'
    | 'textbox-rich'
    | 'document-reference'
    | 'date'
    | 'image'
    | 'map'
    | 'author'
    | 'date-time'
    | 'slide-toggle';

export type DocumentFieldValidator = 'required';

export type DocumentReferenceType = 'file' | 'document';

export interface DocumentField {
    key: string;
    title: string;
    type: DocumentFieldFormElement;
    isTitle?: boolean;
    referenceType?: DocumentReferenceType;
    defaultValue?: any;
    validators: DocumentFieldValidator[];
}


export interface DocumentCount {
    published: number;
    unpublished: number;
}

export interface DocumentType {
    id: string; // Document id
    title: string; // Presentation name
    slug: string; // Root slug to group entries by
    standalone: boolean; // True if the content can be presented on a page with URL of its own
    description: string;
    icon: string; // Icon for menus etc
    fields: DocumentField[];
    numEntries: DocumentCount;
    updated: any; // firebase.firestore.Timestamp | firebase.firestore.FieldValue
    created: any; // firebase.firestore.Timestamp | firebase.firestore.FieldValue
}
