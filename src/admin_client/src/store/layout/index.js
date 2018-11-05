import { LAYOUT } from '../types';
import mutations from './mutations';
import getters from './getters';

const state = {
  layout: 'DefaultLayout',
  postMode: 'post'
};

export default {
  state,
  mutations: {
    [LAYOUT]: mutations.layout
  },
  getters: {
    [LAYOUT]: getters.layout
  }
};
