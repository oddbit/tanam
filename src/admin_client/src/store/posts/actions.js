import firestore from '@/utils/firestore';
import { POST_SET, POST_PUBLISHED, POST_DRAFT } from '../types';

const getPublishedEvents = ({ commit }) => {
  firestore
    .collection('posts-events')
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

const getDraftEvents = ({ commit }) => {
  firestore
    .collection('posts-events')
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

const getEventBy = async ({ commit }, payload) => {
  firestore
    .collection('posts-events')
    .doc(payload)
    .get()
    .then(doc => {
      commit(POST_SET, doc.data());
    });
};

export default {
  getPublishedEvents,
  getDraftEvents,
  getEventBy
};
