import { TEMPLATE_IMAGES, TEMPLATE_CONTENTTYPES } from '../types';
import actions from './actions';
import mutations from './mutations';

const state = {
  images: [],
  contentTypes: []
};

export default {
  state,
  actions: {
    [TEMPLATE_IMAGES]: actions.getImages,
    [TEMPLATE_CONTENTTYPES]: actions.getContentTypes
  },
  mutations: {
    [TEMPLATE_IMAGES]: mutations.setImages,
    [TEMPLATE_CONTENTTYPES]: mutations.setContentTypes
  }
};
