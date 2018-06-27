import {
  GET_PUBLISHED_EVENTS,
  GET_DRAFT_EVENTS,
  GET_EVENT_BY,
  POST_ID,
  PUBLISHED_EVENTS,
  DRAFT_EVENTS,
  POST_DIALOG_DELETE,
  CUSTOM_DELETE_POST
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
    [PUBLISHED_EVENTS]: mutations.setPublishedEvents,
    [DRAFT_EVENTS]: mutations.setDraftEvents,
    [POST_DIALOG_DELETE]: mutations.setDialogDelete
  },
  getters: {
    [POST_ID]: getters.getPostID,
    [PUBLISHED_EVENTS]: getters.getPublishedEvent,
    [DRAFT_EVENTS]: getters.getDraftEvent,
    [POST_DIALOG_DELETE]: getters.getDialogDelete
  },
  actions: {
    [GET_PUBLISHED_EVENTS]: actions.getPublishedEvents,
    [GET_DRAFT_EVENTS]: actions.getDraftEvents,
    [GET_EVENT_BY]: actions.getEventBy,
    [PUBLISHED_EVENTS]: actions.setPublishedEvents,
    [DRAFT_EVENTS]: actions.setDraftEvents,
    [CUSTOM_DELETE_POST]: actions.deletePost
  }
};
