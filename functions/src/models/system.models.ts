
export type SystemNotificationType = 'error';
export interface SystemNotification {
    id: string;
    type: SystemNotificationType;
    title: string;
    message: string;
    systemMessage: string;
    isRead: boolean;
    created: any; // firebase.firestore.Timestamp | firebase.firestore.FieldValue.serverTimestamp;
}
