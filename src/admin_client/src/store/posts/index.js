import {
  POST_IS_EDITED_MODE,
  POST_IS_SHOW_DRAWER,
  POST_PUBLISH,
  POST_IS_SUBMITTING,
  POST_PUBLISHED,
  POST_UNPUBLISHED,
  POST_FIELD_TITLE,
  POST_FIELD_PERMALINK,
  POST_SINGLE,
  POST_FIELD_STATUS,
  POST_FIELD_PERMALINK_EDIT
} from '@/store/types';
import * as actions from './actions';
import * as mutations from './mutations';
import * as getters from './getters';

const state = {
  isEditedMode: false,
  isShowDrawer: true,
  isSubmitting: false,
  postsPublished: [],
  postsUnpublished: [],
  postTitle: '',
  postPermalink: '',
  postStatus: null
};

export default {
  state,
  mutations: {
    [POST_IS_EDITED_MODE]: mutations.setIsEditedMode,
    [POST_IS_SHOW_DRAWER]: mutations.setIsShowDrawer,
    [POST_IS_SUBMITTING]: mutations.setIsSubmitting,
    [POST_PUBLISHED]: mutations.setPostsPublished,
    [POST_UNPUBLISHED]: mutations.setPostsUnpublished,
    [POST_FIELD_TITLE]: mutations.setPostTitle,
    [POST_FIELD_PERMALINK]: mutations.setPostPermalink,
    [POST_FIELD_PERMALINK_EDIT]: mutations.setPostPermalinkEdit,
    [POST_FIELD_STATUS]: mutations.setPostStatus
  },
  getters: {
    [POST_IS_EDITED_MODE]: getters.getIsEditedMode,
    [POST_IS_SHOW_DRAWER]: getters.getIsShowDrawer,
    [POST_IS_SUBMITTING]: getters.getIsSubmitting,
    [POST_PUBLISHED]: getters.getPostsPublished,
    [POST_UNPUBLISHED]: getters.getPostsUnpublished,
    [POST_FIELD_TITLE]: getters.getPostTitle,
    [POST_FIELD_PERMALINK]: getters.getPostPermalink,
    [POST_FIELD_STATUS]: getters.getPostStatus
  },
  actions: {
    [POST_PUBLISH]: actions.publishPost,
    [POST_PUBLISHED]: actions.getPublishedPost,
    [POST_UNPUBLISHED]: actions.getUnpublishedPost,
    [POST_SINGLE]: actions.getSinglePost
  }
};
