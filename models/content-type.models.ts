
export type DocumentFieldFormElement = 'input-text'
    | 'input-number'
    | 'textbox-plain'
    | 'textbox-rich'
    | 'date'
    | 'time'
    | 'date-time'
    | 'slide-toggle';

export interface DocumentField {
    key: string;
    title: string;
    type: DocumentFieldFormElement;
}

export interface DocumentCount {
    published: number;
    unpublished: number;
}

export interface DocumentType {
    id: string; // Document id
    title: string; // Presentation name
    slug: string; // Root slug to group entries by
    template: string;
    standalone: boolean; // True if the content can be presented on a page with URL of its own
    description: string;
    icon: string; // Icon for menus etc
    fields: DocumentField[];
    jsonLd: string; // JSON-LD data (see schema.org and https://en.wikipedia.org/wiki/JSON-LD)
    numEntries: DocumentCount;
    updated: any; // firebase.firestore.Timestamp | firebase.firestore.FieldValue
    created: any; // firebase.firestore.Timestamp | firebase.firestore.FieldValue
}
