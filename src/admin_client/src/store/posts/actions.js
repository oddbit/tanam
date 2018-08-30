import { firestore } from '@/utils/firebase';
import {
  POST_SET_POSTS,
  POST_PUBLISHED,
  POST_DRAFT,
  POST_CONTENT_TYPE
} from '../types';

const getPublishedPosts = ({ commit, getters }) => {
  firestore
    .collection(getters[POST_CONTENT_TYPE])
    .where('status', '==', 'published')
    .onSnapshot(snapshot => {
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
    .collection(getters[POST_CONTENT_TYPE])
    .where('status', '==', 'draft')
    .onSnapshot(snapshot => {
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
    .collection(getters[POST_CONTENT_TYPE])
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
