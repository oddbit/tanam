import firebase from 'firebase/app';
import { SET_USER } from '@/store/types';
import router from '@/router';

const loginGoogle = ({ commit }) => {
  firebase
    .auth()
    .signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(({ user }) => {
      const loggedInUser = {
        id: user.uid,
        email: user.email
      };

      commit(SET_USER, loggedInUser);
    })
    .catch(error => {
      console.log('Error:', error);
    });
};

const autoLogin = ({ commit }, payload) => {
  const { uid, email } = payload;
  commit(SET_USER, {
    id: uid,
    email
  });
};

const logout = ({ commit }) => {
  firebase.auth().signOut();
  commit(SET_USER, null);
  router.push('/login');
};

export default {
  loginGoogle,
  autoLogin,
  logout
};
