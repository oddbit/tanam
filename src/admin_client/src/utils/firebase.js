import firebase from 'firebase/app';
import firebaseui from 'firebaseui';

let fbConfig;

if (process.env.NODE_ENV === 'development') {
  const { devFbConfig } = require('../firebaseConfig.js');
  fbConfig = devFbConfig;
} else {
  fbConfig = window.__FIREBASE_CONFIG__;
}

firebase.initializeApp(fbConfig);

export const firebaseUI = new firebaseui.auth.AuthUI(firebase.auth());
