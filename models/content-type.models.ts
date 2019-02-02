
export type ContentTypeFieldFormElements = 'input-text'
    | 'input-number'
    | 'textbox-plain'
    | 'textbox-rich'
    | 'date'
    | 'time'
    | 'date-time'
    | 'slide-toggle';

export interface ContentTypeField {
    key: string;
    title: string;
    type: ContentTypeFieldFormElements;
}

export interface ContentTypeEntryCount {
    published: number;
    unpublished: number;
}

export interface ContentType {
    id: string; // Document id
    title: string; // Presentation name
    slug: string; // Root slug to group entries by
    template: string;
    standalone: boolean; // True if the content can be presented on a page with URL of its own
    description: string;
    icon: string; // Icon for menus etc
    fields: ContentTypeField[];
    numEntries: ContentTypeEntryCount;
    updated: any; // firebase.firestore.Timestamp | firebase.firestore.FieldValue
    created: any; // firebase.firestore.Timestamp | firebase.firestore.FieldValue
}
