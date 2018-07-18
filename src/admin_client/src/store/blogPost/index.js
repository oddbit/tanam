import {
  BLOG_POST_TITLE,
  BLOG_POST_FEATURED_IMAGE,
  BLOG_POST_PERMALINK,
  BLOG_POST_CONTENT,
  BLOG_POST_SUBMIT,
  BLOG_POST_UPDATE,
  BLOG_SET_POST,
  BLOG_SET_POST_TO_NULL,
  BLOG_DELETE_POST
} from '../types';
import mutations from './mutations';
import getters from './getters';
import actions from './actions';

const state = {
  title: null,
  featuredImage: null,
  permalink: null,
  content: null,
  status: null,
  createdAt: null,
  publishedAt: null,
  updatedAt: null,
  deletedAt: null
};

export default {
  state,
  getters: {
    [BLOG_POST_TITLE]: getters.title,
    [BLOG_POST_FEATURED_IMAGE]: getters.featuredImage,
    [BLOG_POST_PERMALINK]: getters.permalink,
    [BLOG_POST_CONTENT]: getters.content
  },
  mutations: {
    [BLOG_POST_TITLE]: mutations.setTitle,
    [BLOG_POST_FEATURED_IMAGE]: mutations.setFeaturedImage,
    [BLOG_POST_PERMALINK]: mutations.setPermalink,
    [BLOG_POST_CONTENT]: mutations.setContent,
    [BLOG_SET_POST]: mutations.setPost,
    [BLOG_SET_POST_TO_NULL]: mutations.setPostToNull
  },
  actions: {
    [BLOG_POST_SUBMIT]: actions.publishPost,
    [BLOG_POST_UPDATE]: actions.updatePost,
    [BLOG_DELETE_POST]: actions.deletePost
  }
};
