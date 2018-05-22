import Vue from 'vue';
import Vuex from 'vuex';
import users from './users';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    users
  }
});
