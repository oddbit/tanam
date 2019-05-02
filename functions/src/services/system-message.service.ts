import * as admin from 'firebase-admin';
import { SystemNotification } from '../models/system';

const siteCollection = () => admin.firestore().collection('tanam').doc(process.env.GCLOUD_PROJECT);

export function reportError(title: string, message: string, systemMessage: string) {
    const notificationDocRef = siteCollection().collection('notifications').doc();
    const errorMessage: SystemNotification = {
        id: notificationDocRef.id,
        type: 'error',
        title: title,
        message: message,
        systemMessage: systemMessage,
        isRead: false,
        created: admin.firestore.FieldValue.serverTimestamp(),
    };

    return notificationDocRef.set(errorMessage);
}
