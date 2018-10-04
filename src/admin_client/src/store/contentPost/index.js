import {
  CONTENTTYPE_POST,
  CONTENTTYPE_DRAFT,
  CONTENT_TYPES_POST_ADD
} from '../types';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

const state = {
  contentTypeDraft: [],
  contentTypePost: []
};

export default {
  state,
  mutations: {
    [CONTENTTYPE_POST]: mutations.setPublishedPosts,
    [CONTENTTYPE_DRAFT]: mutations.setUnPublishedPosts
  },
  getters: {
    [CONTENTTYPE_POST]: getters.getPosts,
    [CONTENTTYPE_DRAFT]: getters.getDraft
  },
  actions: {
    [CONTENTTYPE_POST]: actions.getPublishedPosts,
    [CONTENTTYPE_DRAFT]: actions.getDraftPosts,
    [CONTENT_TYPES_POST_ADD]: actions.addPost
  }
};
