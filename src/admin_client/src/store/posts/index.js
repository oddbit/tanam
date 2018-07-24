import {
  POST_CONTENT_TYPE,
  POST_BY,
  POST_ID,
  POST_PUBLISHED,
  POST_DRAFT,
  POST_DIALOG_DELETE
} from '../types';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';

const state = {
  contentType: null,
  postId: null,
  publishedPosts: [],
  draftPosts: [],
  dialogDelete: false
};

export default {
  state,
  mutations: {
    [POST_CONTENT_TYPE]: mutations.setContentType,
    [POST_ID]: mutations.setPostId,
    [POST_PUBLISHED]: mutations.setPublishedPosts,
    [POST_DRAFT]: mutations.setDraftPosts,
    [POST_DIALOG_DELETE]: mutations.setDialogDelete
  },
  getters: {
    [POST_CONTENT_TYPE]: getters.getContentType,
    [POST_ID]: getters.getPostId,
    [POST_PUBLISHED]: getters.getPublishedPosts,
    [POST_DRAFT]: getters.getDraftPosts,
    [POST_DIALOG_DELETE]: getters.getDialogDelete
  },
  actions: {
    [POST_BY]: actions.getPostBy,
    [POST_PUBLISHED]: actions.getPublishedPosts,
    [POST_DRAFT]: actions.getDraftPosts
  }
};
