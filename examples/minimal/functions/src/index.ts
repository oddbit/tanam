import * as admin from 'firebase-admin';
import * as tanam from 'tanam';

admin.initializeApp();
tanam.initializeApp({
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: ''
  }
});

export * from 'tanam';