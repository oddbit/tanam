import {
  CONTENT_TYPES_NAMES,
  CONTENT_TYPES_FIELD,
  CONTENT_TYPES_FIELDS
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
    [CONTENT_TYPES_NAMES]: getters.getNames,
    [CONTENT_TYPES_FIELDS]: getters.getFields
  },
  mutations: {
    [CONTENT_TYPES_NAMES]: mutations.commitNames,
    [CONTENT_TYPES_FIELD]: mutations.commitFields
  },
  actions: {
    [CONTENT_TYPES_NAMES]: actions.dispatchNames,
    [CONTENT_TYPES_FIELD]: actions.dispatchField
  }
};
