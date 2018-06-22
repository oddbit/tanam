import { GET_PUBLISHED_EVENTS, GET_DRAFT_EVENTS } from '../types';
import actions from './actions';

export default {
  actions: {
    [GET_PUBLISHED_EVENTS]: actions.getPublishedEvents,
    [GET_DRAFT_EVENTS]: actions.getDraftEvents
  }
};
