import { SET_LAYOUT, CURRENT_LAYOUT } from '../types';
import mutations from './mutations';
import getters from './getters';

const state = {
  layout: 'DefaultLayout'
};

export default {
  state,
  mutations: {
    [SET_LAYOUT]: mutations.setLayout
  },
  getters: {
    [CURRENT_LAYOUT]: getters.currentLayout
  }
};
