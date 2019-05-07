
export type SystemNotificationType = 'error' | 'info';
export interface SystemNotification {
    id: string;
    type: SystemNotificationType;
    title: string;
    message: string;
    isRead: boolean;
    numOccurances: any; // number | firebase.firestore.FieldValue.increment;
    updated: any; // firebase.firestore.Timestamp | firebase.firestore.FieldValue.serverTimestamp;
    created: any; // firebase.firestore.Timestamp | firebase.firestore.FieldValue.serverTimestamp;
}
