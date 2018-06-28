import {
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
  postID: null,
  publishedEvents: [],
  draftEvents: [],
  dialogDelete: false
};

export default {
  state,
  mutations: {
    [POST_ID]: mutations.setPostID,
    [POST_PUBLISHED]: mutations.setPublishedEvents,
    [POST_DRAFT]: mutations.setDraftEvents,
    [POST_DIALOG_DELETE]: mutations.setDialogDelete
  },
  getters: {
    [POST_ID]: getters.getPostID,
    [POST_PUBLISHED]: getters.getPublishedEvent,
    [POST_DRAFT]: getters.getDraftEvent,
    [POST_DIALOG_DELETE]: getters.getDialogDelete
  },
  actions: {
    [POST_BY]: actions.getEventBy,
    [POST_PUBLISHED]: actions.getPublishedEvents,
    [POST_DRAFT]: actions.getDraftEvents
  }
};
