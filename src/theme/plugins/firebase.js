import firebase from 'firebase/app';
import 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyD-sz6tSPCKKhQBJnl1SuAzrnMktnMOFSI',
  authDomain: 'tanam-dev.firebaseapp.com',
  databaseURL: 'https://tanam-dev.firebaseio.com',
  projectId: 'tanam-dev',
  storageBucket: 'tanam-dev.appspot.com',
  messagingSenderId: '2622678578'
};

const firebaseApp = !firebase.apps.length
  ? firebase.initializeApp(config)
  : firebase.app();

const firestore = firebaseApp.firestore();
firestore.settings({ timestampsInSnapshots: true });

export { firestore };
