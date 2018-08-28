import firebase from 'firebase/app';
import firebaseui from 'firebaseui';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/storage';

let fbConfig;

if (process.env.NODE_ENV === 'development') {
  const { devFbConfig } = require('../firebaseConfig.js');
  fbConfig = devFbConfig;
} else {
  fbConfig = window.__FIREBASE_CONFIG__;
}

firebase.initializeApp(fbConfig);

const firebaseUI = new firebaseui.auth.AuthUI(firebase.auth());
const firestore = firebase.firestore();
const rtdb = firebase.database();
const storageRef = firebase.storage().ref();

firestore.settings({ timestampsInSnapshots: true });

const contentImages = rtdb
  .ref('/contentFiles/')
  .orderByChild('fileType')
  .equalTo('image')
  .once('value');

export { firebaseUI, firestore, contentImages, storageRef };
