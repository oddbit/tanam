import firebase from 'firebase/app';
import { SET_USER } from '@/store/types';
import router from '@/router';
import { firestore } from '@/utils/firebase';

const commitUser = (uid, email, displayName, isOwner) => {
  return {
    id: uid,
    email,
    displayName,
    isOwner
  };
};

const autoLogin = async ({ commit }, payload) => {
  const { uid, email, displayName } = payload;
  const userToken = await firebase.auth().currentUser.getIdTokenResult();
  const userRef = firestore.collection('users').doc(uid);
  const unsubscribeUser = userRef.onSnapshot(doc => {
    const user = doc.data();

    if (doc.exists) {
      if (user.isOwner) {
        commit(SET_USER, commitUser(uid, email, displayName, true));
      }
      unsubscribeUser();
    }
  });
  const isOwner = userToken.claims.isOwner || false;
  commit(SET_USER, commitUser(uid, email, displayName, isOwner));
};

const logout = async ({ commit }) => {
  await firebase.auth().signOut();
  await commit(SET_USER, null);
  router.push('/login');
};

export default {
  autoLogin,
  logout
};
