export type AdminTheme = 'default' | 'light' | 'dark';

export const ADMIN_THEMES = {
    'default': 'tanam-light-theme',
    'light': 'tanam-light-theme',
    'dark': 'tanam-dark-theme',
};

export interface ThemeTemplate {
    id: string;
    title: string;
    selector: string;
    template: string;
    styles: string[];
    updated: any; // firebase.firestore.Timestamp | firebase.firestore.FieldValue
    created: any; // firebase.firestore.Timestamp | firebase.firestore.FieldValue
}

export interface Theme {
    id: string;
    title: string;
    description: string;
    images: string[];
    styles: string[];
    scripts: string[];
    updated: any; // firebase.firestore.Timestamp | firebase.firestore.FieldValue
    created: any; // firebase.firestore.Timestamp | firebase.firestore.FieldValue
}
