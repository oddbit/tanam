import { firestore } from '@/utils/firebase';
import {
  CONTENTTYPE_POST,
  CONTENTTYPE_DRAFT
  // CONTENT_TYPES_POST_ADD
} from '../types';

const addPost = ({ commit }, payload) => {
  console.log('action add post');
  console.log(payload);
  firestore
    .collection(payload.contentType)
    .add({
      data: payload.post,
      path: ['/staticpath', '/staticpath2'],
      permalink: 'staticpermalink',
      publishTime: new Date(),
      status: 'static',
      tags: ['statictags1', 'statictag2'],
      template: 'staticTemplate'
    })
    .then(res => {
      console.log('Post writed successfully');
      console.log(res);
    });
};

const getPublishedPosts = ({ commit }, payload) => {
  firestore
    .collection(payload)
    .where('status', '==', 'published')
    .onSnapshot(snapshot => {
      const arr = [];
      commit(CONTENTTYPE_POST, []);
      snapshot.forEach(doc => {
        arr.push({
          ...doc.data(),
          key: doc.id
        });
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
        arr.push({
          ...doc.data(),
          key: doc.id
        });
      });
      commit(CONTENTTYPE_DRAFT, arr);
    });
};

export default {
  getPublishedPosts,
  getDraftPosts,
  addPost
};
