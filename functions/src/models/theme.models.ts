export type AdminTheme = 'default' | 'light' | 'dark';

export const ADMIN_THEMES = {
  'default': 'tanam-light-theme',
  'light': 'tanam-light-theme',
  'dark': 'tanam-dark-theme',
};

export type TemplateType = 'dust';

export interface ThemeTemplate {
  id: string;
  title: string;
  selector: string;
  template: string;
  templateType: TemplateType;
  updated: any; // firebase.firestore.Timestamp | firebase.firestore.FieldValue
  created: any; // firebase.firestore.Timestamp | firebase.firestore.FieldValue
}

export interface Theme {
  id: string;
  title: string;
  description: string;
  updated: any; // firebase.firestore.Timestamp | firebase.firestore.FieldValue
  created: any; // firebase.firestore.Timestamp | firebase.firestore.FieldValue
}

export interface ThemeTemplateQueryOptions {
  limit?: number;
  orderBy?: {
    field: string,
    sortOrder: 'asc' | 'desc',
  };
  startAfter?: any; // firebase.firestore.DocumentSnapshot
}

export interface ThemeAssetQueryOptions {
  limit?: number;
  orderBy?: {
    field: string,
    sortOrder: 'asc' | 'desc',
  };
  startAfter?: any; // firebase.firestore.DocumentSnapshot
}
