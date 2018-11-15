import { PAGE_SAVE, PAGE_GET, PAGE_FIELDS, PAGE_DELETE } from '@/store/types';
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
    [PAGE_SAVE]: actions.savePage,
    [PAGE_GET]: actions.getPages,
    [PAGE_DELETE]: actions.deletePage
  }
};
