import { CONTENT_TYPE_NAMES, CONTENT_TYPES_GET } from '@/store/types';
import * as getters from './getters';
import * as mutations from './mutations';
import * as actions from './actions';

const state = {
  names: null,
  fields: {}
};

export default {
  state,
  getters: {
    [CONTENT_TYPE_NAMES]: getters.getNames,
    [CONTENT_TYPES_GET]: getters.getFields
  },
  mutations: {
    [CONTENT_TYPE_NAMES]: mutations.commitNames,
    [CONTENT_TYPES_GET]: mutations.commitFields
  },
  actions: {
    [CONTENT_TYPES_GET]: actions.dispatchContentTypes
  }
};
