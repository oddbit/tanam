import Vue from 'vue';
import Vuex from 'vuex';
import users from './users';
import templates from './templates';
import layout from './layout';
import ui from './ui';
import manageContentType from './manage/contentType';
import posts from './posts';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    users,
    templates,
    layout,
    ui,
    manageContentType,
    posts
  }
});
