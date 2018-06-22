import { GET_PUBLISHED_EVENTS } from '../types';
import actions from './actions';

export default {
  actions: {
    [GET_PUBLISHED_EVENTS]: actions.getPublishedEvents
  }
};
