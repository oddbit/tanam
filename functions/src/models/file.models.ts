
export type FileType = 'image' | 'video' | 'document';

export interface TanamFile {
  id: string;
  title: string;
  bucket: string;
  filePath: string;
  fileType: string;
  mimeType: string;
  bytes: number;
  variants?: {
    small: string,
    medium: string,
    large: string,
  };
  updated: any; // firebase.firestore.Timestamp | firebase.firestore.FieldValue
  created: any; // firebase.firestore.Timestamp | firebase.firestore.FieldValue
}

export const MIME_TYPE_ENDING_MAP = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/png': 'png',
  'image/tiff': 'tiff',
  'image/bmp': 'bmp',
  'image/ico': 'ico',
  'image/svg+xml': 'svg',
  'image/webp': 'webp',
};

export interface MediaFilesQueryOptions {
  limit?: number;
  orderBy?: {
    field: string,
    sortOrder: 'asc' | 'desc',
  };
  startAfter?: any; // firebase.firestore.DocumentSnapshot
}
