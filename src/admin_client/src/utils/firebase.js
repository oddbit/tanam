import firebase from 'firebase/app';
import firebaseui from 'firebaseui';

// firebase.initializeApp({
//   apiKey: 'AIzaSyD-sz6tSPCKKhQBJnl1SuAzrnMktnMOFSI',
//   authDomain: 'tanam-dev.firebaseapp.com',
//   databaseURL: 'https://tanam-dev.firebaseio.com',
//   projectId: 'tanam-dev',
//   storageBucket: 'tanam-dev.appspot.com',
//   messagingSenderId: '2622678578'
// });

export const firebaseUI = new firebaseui.auth.AuthUI(firebase.auth());
