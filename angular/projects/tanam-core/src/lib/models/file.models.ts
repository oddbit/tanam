
export type FileType = 'image' | 'video' | 'document';

export interface TanamFile {
    id: string;
    title: string;
    bucket: string;
    filePath: string;
    fileType: string;
    mimeType: string;
    bytes: number;
    url: string;
    updatedAt: any; // firebase.firestore.Timestamp | firebase.firestore.FieldValue
    createdAt: any; // firebase.firestore.Timestamp | firebase.firestore.FieldValue
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
