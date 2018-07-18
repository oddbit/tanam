import Vue from 'vue';
import Router from 'vue-router';
import firebase from 'firebase/app';
import { SET_LAYOUT } from '@/store/types';
import { store } from '@/store';

const routerOptions = [
  {
    path: '/',
    name: 'home',
    component: 'Home'
  },
  {
    path: '/login',
    name: 'login',
    component: 'Login',
    meta: { layout: 'SimpleLayout' }
  },
  {
    path: '/events',
    name: 'events',
    component: 'Events/index'
  },
  {
    path: '/events/post',
    name: 'events-post',
    component: 'Events/Post/index',
    meta: { layout: 'SinglePostLayout' }
  },
  {
    path: '/events/post/:slug',
    name: 'events-post-slug',
    component: 'Events/Post/_slug',
    meta: { layout: 'SinglePostLayout' }
  },
  {
    path: '/profile',
    name: 'profile',
    component: 'Profile/MyProfile'
  },
  {
    path: '/profile/account-settings',
    name: 'account-settings',
    component: 'Profile/AccountSettings'
  },
  {
    path: '/blog',
    name: 'blog',
    component: 'Blog/index'
  },
  {
    path: '/blog/post',
    name: 'blog-post',
    component: 'Blog/Post/index',
    meta: { layout: 'SingleBlogLayout' }
  },
  {
    path: '/blog/post/:slug',
    name: 'blog-post-slug',
    component: 'Blog/Post/_slug',
    meta: { layout: 'SingleBlogLayout' }
  }
];

const routes = routerOptions.map(route => ({
  ...route,
  component: () => import(`@/views/${route.component}.vue`)
}));

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes
});

router.beforeEach((to, from, next) => {
  store.commit(SET_LAYOUT, to.meta.layout);

  const isAuthenticated = firebase.auth().currentUser;
  if (isAuthenticated) {
    next();
  } else {
    if (to.path !== '/login') {
      next('login');
    } else {
      next();
    }
  }
});

export default router;
