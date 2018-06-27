import { SET_LAYOUT, CURRENT_LAYOUT, POST_MODE } from '../types';
import mutations from './mutations';
import getters from './getters';

const state = {
  layout: 'DefaultLayout',
  postMode: 'post'
};

export default {
  state,
  mutations: {
    [SET_LAYOUT]: mutations.setLayout,
    [POST_MODE]: mutations.setPostMode
  },
  getters: {
    [CURRENT_LAYOUT]: getters.currentLayout,
    [POST_MODE]: getters.postMode
  }
};
