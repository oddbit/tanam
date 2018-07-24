import Vue from 'vue';
import Vuex from 'vuex';
import users from './users';
import drawer from './drawer';
import layout from './layout';
import posts from './posts';
import singlePost from './singlePost';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    users,
    drawer,
    layout,
    posts,
    singlePost
  }
});
