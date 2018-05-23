import { TOGGLE_DRAWER } from '../types';
import mutations from './mutations';

const state = {
  status: false
};

export default {
  state,
  mutations: {
    [TOGGLE_DRAWER]: mutations.toggleDrawer
  }
};
