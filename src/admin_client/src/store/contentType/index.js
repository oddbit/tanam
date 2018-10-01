import {
  CONTENT_TYPE_NAMES,
  CONTENT_TYPE_FIELD,
  CONTENT_TYPE_FIELDS
} from '@/store/types';
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
    [CONTENT_TYPE_FIELDS]: getters.getFields
  },
  mutations: {
    [CONTENT_TYPE_NAMES]: mutations.commitNames,
    [CONTENT_TYPE_FIELDS]: mutations.commitFields
  },
  actions: {
    [CONTENT_TYPE_NAMES]: actions.dispatchNames,
    [CONTENT_TYPE_FIELDS]: actions.dispatchFields
  }
};
