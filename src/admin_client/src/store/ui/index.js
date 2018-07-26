import { BTN_SUBMIT_SINGLE_POST, BTN_DELETE_SINGLE_POST } from '../types';
import mutations from './mutations';
import getters from './getters';

const state = {
  btnSubmitSinglePost: false,
  btnDeleteSinglePost: false
};

export default {
  state,
  getters: {
    [BTN_DELETE_SINGLE_POST]: getters.getBtnDeleteSinglePost,
    [BTN_SUBMIT_SINGLE_POST]: getters.getBtnSubmitSinglePost
  },
  mutations: {
    [BTN_SUBMIT_SINGLE_POST]: mutations.setBtnSubmitSinglePost,
    [BTN_DELETE_SINGLE_POST]: mutations.setBtnDeleteSinglePost
  }
};
