import * as admin from 'firebase-admin';
import { SystemNotification } from '../models/system.models';

const siteCollection = () => admin.firestore().collection('tanam').doc(process.env.GCLOUD_PROJECT);


/**
 * Creates a system message about missing index.
 *
 * Use it like this:
 *  1. Run a query that requires an index within a try/catch
 *  2. Extract the message from the exception `exception.details`
 *  3. Pass that messaage details string into this function
 *
 * The messaage details will contain a link similar to this:
 * `https://console.firebase.google.com/project/<project id>/database/firestore/indexes?create_composite=<base64 encoded data>`
 *
 * @param message Error message from Firebase SDK exception
 */
export function reportMissingIndex(message: string) {
    const notificationDocRef = siteCollection().collection('notifications').doc();
    const createIndexUrl = message.match(/(https:\/\/.*)$/)[1];
    const errorMessage: SystemNotification = {
        id: notificationDocRef.id,
        type: 'error',
        title: 'Missing database index',
        message: `One of your templates is missing a database index. You can create it by <a target="_blank" href="${createIndexUrl}">clicking here</a>.`,
        isRead: false,
        created: admin.firestore.FieldValue.serverTimestamp(),
    };

    return notificationDocRef.set(errorMessage);
}
// The query requires an index. You can create it here: https://console.firebase.google.com/project/tanam-e8e7d/database/firestore/indexes?create_composite=Ck1wcm9qZWN0cy90YW5hbS1lOGU3ZC9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvZG9jdW1lbnRzL2luZGV4ZXMvXxABGhAKDGRvY3VtZW50VHlwZRABGgoKBnN0YXR1cxABGgsKB3VwZGF0ZWQQAhoMCghfX25hbWVfXxAC
