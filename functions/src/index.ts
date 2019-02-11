
import * as admin from 'firebase-admin';

if (admin.apps.length === 0) {
    admin.initializeApp();
}

admin.firestore().settings({ timestampsInSnapshots: true });

export * from './triggers/cache';
export * from './triggers/entries';
export * from './triggers/site';
export * from './triggers/theme';
export * from './triggers/users';
export * from './render';
