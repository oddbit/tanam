import {
  GET_BLOG_BY,
  BLOG_POST_ID,
  PUBLISHED_BLOGS,
  DRAFT_BLOGS,
  BLOG_POST_DIALOG_DELETE,
  GET_PUBLISHED_BLOGS,
  GET_DRAFT_BLOGS,
  BLOG_CUSTOM_DELETE_POST
} from '../types';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';

const state = {
  postID: null,
  publishedBlogs: [],
  draftBlogs: [],
  dialogDelete: false
};

export default {
  state,
  mutations: {
    [BLOG_POST_ID]: mutations.setPostID,
    [PUBLISHED_BLOGS]: mutations.setPublishedBlogs,
    [DRAFT_BLOGS]: mutations.setDraftBlogs,
    [BLOG_POST_DIALOG_DELETE]: mutations.setDialogDelete
  },
  getters: {
    [BLOG_POST_ID]: getters.getPostID,
    [PUBLISHED_BLOGS]: getters.getPublishedBlogs,
    [DRAFT_BLOGS]: getters.getDraftBlogs,
    [BLOG_POST_DIALOG_DELETE]: getters.getDialogDelete
  },
  actions: {
    [GET_BLOG_BY]: actions.getBlogBy,
    [GET_PUBLISHED_BLOGS]: actions.getPublishedBlogs,
    [GET_DRAFT_BLOGS]: actions.getDraftBlogs,
    [BLOG_CUSTOM_DELETE_POST]: actions.deletePost
  }
};
