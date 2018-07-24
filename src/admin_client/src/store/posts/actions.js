import firestore from '@/utils/firestore';
import { POST_SET_POSTS, POST_PUBLISHED, POST_DRAFT } from '../types';
import { collection } from '@/utils/firestoreCollection';

const getPublishedPosts = ({ commit, getters }) => {
  firestore
    .collection(collection(getters))
    .where('status', '==', 'published')
    .get()
    .then(snapshot => {
      const arr = [];
      commit(POST_PUBLISHED, []);
      snapshot.forEach(doc => {
        arr.push({ ...doc.data(), key: doc.id });
      });
      commit(POST_PUBLISHED, arr);
    });
};

const getDraftPosts = ({ commit, getters }) => {
  firestore
    .collection(collection(getters))
    .where('status', '==', 'draft')
    .get()
    .then(snapshot => {
      const arr = [];
      commit(POST_DRAFT, []);
      snapshot.forEach(doc => {
        arr.push({ ...doc.data(), key: doc.id });
      });
      commit(POST_DRAFT, arr);
    });
};

const getPostBy = async ({ commit, getters }, payload) => {
  firestore
    .collection(collection(getters))
    .doc(payload)
    .get()
    .then(doc => {
      commit(POST_SET_POSTS, doc.data());
    });
};

export default {
  getPublishedPosts,
  getDraftPosts,
  getPostBy
};
