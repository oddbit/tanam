import {
  GET_PUBLISHED_EVENTS,
  GET_DRAFT_EVENTS,
  GET_EVENT_BY,
  POST_ID
} from '../types';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';

const state = {
  postID: null
};

export default {
  state,
  mutations: {
    [POST_ID]: mutations.setPostID
  },
  getters: {
    [POST_ID]: getters.getPostID
  },
  actions: {
    [GET_PUBLISHED_EVENTS]: actions.getPublishedEvents,
    [GET_DRAFT_EVENTS]: actions.getDraftEvents,
    [GET_EVENT_BY]: actions.getEventBy
  }
};
