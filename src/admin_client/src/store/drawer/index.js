import { TOGGLE_DRAWER, TOGGLE_DRAWER_EVENT_POST } from '../types';
import mutations from './mutations';

const state = {
  status: false,
  statusEventPost: true
};

export default {
  state,
  mutations: {
    [TOGGLE_DRAWER]: mutations.toggleDrawer,
    [TOGGLE_DRAWER_EVENT_POST]: mutations.toggleDrawerEventPost
  }
};
