import firestore from '@/utils/firestore';
import {
  BLOG_SET_POST,
  PUBLISHED_BLOGS,
  DRAFT_BLOGS,
  BLOG_DELETE_POST,
  BLOG_POST_ID,
  BLOG_POST_DIALOG_DELETE
} from '../types';

const getPublishedBlogs = ({ commit }) => {
  firestore
    .collection('posts-blogs')
    .where('status', '==', 'published')
    .get()
    .then(snapshot => {
      const arr = [];
      commit(PUBLISHED_BLOGS, []);
      snapshot.forEach(doc => {
        arr.push({ ...doc.data(), key: doc.id });
      });
      commit(PUBLISHED_BLOGS, arr);
    });
};

const getDraftBlogs = ({ commit }) => {
  firestore
    .collection('posts-blogs')
    .where('status', '==', 'draft')
    .get()
    .then(snapshot => {
      const arr = [];
      commit(DRAFT_BLOGS, []);
      snapshot.forEach(doc => {
        arr.push({ ...doc.data(), key: doc.id });
      });
      commit(DRAFT_BLOGS, arr);
    });
};

const getBlogBy = async ({ commit }, payload) => {
  firestore
    .collection('posts-blogs')
    .doc(payload)
    .get()
    .then(doc => {
      commit(BLOG_SET_POST, doc.data());
    });
};

const deletePost = ({ dispatch, commit, getters }) => {
  dispatch(BLOG_DELETE_POST, getters[BLOG_POST_ID]);
  commit(BLOG_POST_DIALOG_DELETE, { dialogDelete: false });
  commit(BLOG_POST_ID, null);
};

export default {
  getPublishedBlogs,
  getDraftBlogs,
  getBlogBy,
  deletePost
};
