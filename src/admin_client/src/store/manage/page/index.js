import { PAGE_CREATE, PAGE_GET, PAGE_FIELDS } from '@/store/types';
import * as actions from './actions';
import * as mutations from './mutations';
import * as getters from './getters';

const state = {
  fields: []
};

export default {
  state,
  getters: {
    [PAGE_FIELDS]: getters.getFields
  },
  mutations: {
    [PAGE_FIELDS]: mutations.setFields
  },
  actions: {
    [PAGE_CREATE]: actions.createPage,
    [PAGE_GET]: actions.getPages
  }
};
