import Vue from 'vue';
import Vuex from 'vuex';
import users from './users';
import drawer from './drawer';
import layout from './layout';
import singlePost from './singlePost';
import posts from './posts';
import blogPost from './blogPost';
import blogPosts from './blogPosts';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    users,
    drawer,
    layout,
    posts,
    blogPost,
    blogPosts,
    singlePost
  }
});
