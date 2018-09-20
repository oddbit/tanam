import { firestore } from '@/utils/firebase';
import { CONTENTTYPE_POST, CONTENTTYPE_DRAFT } from '../types';

const getPublishedPosts = ({ commit }, payload) => {
  console.log(payload);
  firestore
    .collection(payload)
    .where('status', '==', 'published')
    .onSnapshot(snapshot => {
      console.log(snapshot);
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
