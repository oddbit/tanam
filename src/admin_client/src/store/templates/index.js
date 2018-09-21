import { TEMPLATE_IMAGES } from '../types';
import actions from './actions';
import mutations from './mutations';

const state = {
  images: [],
  contentTypes: []
};

export default {
  state,
  actions: {
    [TEMPLATE_IMAGES]: actions.getImages
  },
  mutations: {
    [TEMPLATE_IMAGES]: mutations.setImages
  }
};
