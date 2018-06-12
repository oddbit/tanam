import {
  CURRENT_USER,
  SET_USER,
  LOGIN_GOOGLE,
  AUTO_LOGIN,
  LOGOUT
} from '../types';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  user: null
};

export default {
  state,
  actions: {
    [LOGIN_GOOGLE]: actions.loginGoogle,
    [AUTO_LOGIN]: actions.autoLogin,
    [LOGOUT]: actions.logout
  },
  getters: {
    [CURRENT_USER]: getters.currentUser
  },
  mutations: {
    [SET_USER]: mutations.setUser
  }
};
