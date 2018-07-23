import { LAYOUT, POST_MODE } from '../types';
import mutations from './mutations';
import getters from './getters';

const state = {
  layout: 'DefaultLayout',
  postMode: 'post'
};

export default {
  state,
  mutations: {
    [LAYOUT]: mutations.layout,
    [POST_MODE]: mutations.postMode
  },
  getters: {
    [LAYOUT]: getters.layout,
    [POST_MODE]: getters.postMode
  }
};
