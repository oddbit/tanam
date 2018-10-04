import Vue from 'vue';
import Vuex from 'vuex';
import users from './users';
import templates from './templates';
import drawer from './drawer';
import layout from './layout';
import posts from './posts';
import singlePost from './singlePost';
import ui from './ui';
import contentType from './contentType';
import contentPost from './contentPost';
import manageContentType from './manage/contentType';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    users,
    templates,
    drawer,
    layout,
    posts,
    singlePost,
    ui,
    contentType,
    contentPost,
    manageContentType
  }
});
