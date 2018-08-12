import { TOGGLE_DRAWER, TOGGLE_DRAWER_POST } from '../types';
import mutations from './mutations';
import getters from './getters';

const state = {
  status: false,
  statusPost: true
};

export default {
  state,
  getters: {
    [TOGGLE_DRAWER]: getters.status,
    [TOGGLE_DRAWER_POST]: getters.statusPost
  },
  mutations: {
    [TOGGLE_DRAWER]: mutations.toggleDrawer,
    [TOGGLE_DRAWER_POST]: mutations.toggleDrawerPost
  }
};
