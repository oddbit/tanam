import { SHA1 } from 'crypto-js';
import * as admin from 'firebase-admin';
import { SystemNotification, SystemNotificationType } from '../models/system.models';

const siteCollection = () => admin.firestore().collection('tanam').doc(process.env.GCLOUD_PROJECT);

function createNoficication(type: SystemNotificationType, title: string, message: string) {
    const id = SHA1(type + title + message).toString().toLowerCase();
    const docRef = siteCollection().collection('notifications').doc(id);

    return admin.firestore().runTransaction(async (trx) => {
        const trxNotifDoc = await trx.get(docRef);
        if (trxNotifDoc.exists) {
            trx.update(docRef, {
                updated: admin.firestore.FieldValue.serverTimestamp(),
                numOccurances: admin.firestore.FieldValue.increment(1),
                isRead: false,
            } as SystemNotification);
        } else {
            trx.set(docRef, {
                id: id,
                type: 'error',
                title: title,
                message: message,
                isRead: false,
                numOccurances: 0,
                updated: admin.firestore.FieldValue.serverTimestamp(),
                created: admin.firestore.FieldValue.serverTimestamp(),
            } as SystemNotification);
        }
    });
}

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
    const createIndexUrl = message.match(/(https:\/\/.*)$/)[1];
    return createNoficication(
        'error',
        'Missing database index',
        `One of your templates is missing a database index. You can create it by <a target="_blank" href="${createIndexUrl}">clicking here</a>.`,
    );
}

export function reportUnknownError(message: string) {
    return createNoficication(
        'error',
        'Unknown error',
         message,
    );
}
