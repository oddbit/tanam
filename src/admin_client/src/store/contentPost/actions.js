import { firestore } from '@/utils/firebase';
import { CONTENTTYPE_POST, CONTENTTYPE_DRAFT } from '../types';

const getPublishedPosts = ({ commit }, payload) => {
  console.log(payload);
  firestore
    .collection(payload)
    .where('status', '==', 'published')
    .onSnapshot(snapshot => {
<<<<<<< HEAD
      console.log(snapshot);
=======
      console.log(snapshot)
>>>>>>> 03c93fd8df6d394ef9d32160793a5858e5531c6b
      const arr = [];
      commit(CONTENTTYPE_POST, []);
      snapshot.forEach(doc => {
        console.log(doc.data());
        arr.push({ ...doc.data(), key: doc.id });
      });
      commit(CONTENTTYPE_POST, arr);
    });
};

const getDraftPosts = ({ commit }, payload) => {
  console.log(payload);
  firestore
    .collection(payload)
    .where('status', '==', 'draft')
    .onSnapshot(snapshot => {
      console.log(snapshot);
      const arr = [];
      commit(CONTENTTYPE_DRAFT, []);
      snapshot.forEach(doc => {
        console.log(doc.data());
        arr.push({ ...doc.data(), key: doc.id });
      });
      commit(CONTENTTYPE_DRAFT, arr);
    });
};

export default {
  getPublishedPosts,
  getDraftPosts
};
