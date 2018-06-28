import Vue from 'vue';
import Vuex from 'vuex';
import users from './users';
import drawer from './drawer';
import layout from './layout';
import singlePost from './singlePost';
import posts from './posts';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    users,
    drawer,
    layout,
    singlePost,
    posts
  }
});
