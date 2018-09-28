import { firestore } from '@/utils/firebase';
import { CONTENTTYPE_POST, CONTENTTYPE_DRAFT } from '../types';

const getPublishedPosts = ({ commit }, payload) => {
  firestore
    .collection(payload)
    .where('status', '==', 'published')
    .onSnapshot(snapshot => {
      const arr = [];
      commit(CONTENTTYPE_POST, []);
      snapshot.forEach(doc => {
        arr.push({ ...doc.data(), key: doc.id });
      });
      commit(CONTENTTYPE_POST, arr);
    });
};

const getDraftPosts = ({ commit }, payload) => {
  firestore
    .collection(payload)
    .where('status', '==', 'draft')
    .onSnapshot(snapshot => {
      const arr = [];
      commit(CONTENTTYPE_DRAFT, []);
      snapshot.forEach(doc => {
        arr.push({ ...doc.data(), key: doc.id });
      });
      commit(CONTENTTYPE_DRAFT, arr);
    });
};

export default {
  getPublishedPosts,
  getDraftPosts
};
