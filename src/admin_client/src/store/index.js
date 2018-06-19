import Vue from 'vue';
import Vuex from 'vuex';
import users from './users';
import drawer from './drawer';
import layout from './layout';
import post from './post';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    users,
    drawer,
    layout,
    post
  }
});
