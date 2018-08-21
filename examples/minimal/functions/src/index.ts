import * as admin from 'firebase-admin';
import * as tanam from '../../../../dist'

admin.initializeApp();
tanam.initializeApp();

export * from '../../../../dist';