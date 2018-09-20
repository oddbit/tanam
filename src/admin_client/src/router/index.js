import Vue from 'vue';
import Router from 'vue-router';
import firebase from 'firebase/app';
import { LAYOUT } from '@/store/types';
import { store } from '@/store';
import { event, blog } from '@/config/post';

const routerOptions = [
  {
    path: '/',
    name: 'home',
    component: 'Home'
  },
  {
    path: '/authenticate',
    name: 'auth',
    component: 'Authenticate'
  },
  {
    path: '/login',
    name: 'login',
    component: 'Login',
    meta: { layout: 'SimpleLayout' }
  },
  {
    path: '/templates/images',
    name: 'templateImages',
    component: 'Templates/Images'
  },
  {
    path: '/templates/pages',
    name: 'templatePages',
    component: 'Templates/Pages/index'
  },
  {
    path: '/templates/pages/post',
    name: 'page-posts',
    component: 'Templates/Pages/Post/index',
    meta: { layout: 'SinglePostLayout' }
  },
  {
    path: `/templates/pages/post/:slug`,
    name: `page-posts-slug`,
    component: 'Templates/Pages/Post/_slug',
    meta: { layout: 'SinglePostLayout' }
  },
  {
    path: event.indexLink,
    name: event.indexName,
    component: 'Events/index'
  },
  {
    path: event.createLink,
    name: event.createName,
    component: 'Events/Post/index',
    meta: { layout: 'SinglePostLayout' }
  },
  {
    path: `${event.createLink}/:slug`,
    name: `${event.createName}-slug`,
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
    path: blog.indexLink,
    name: blog.indexName,
    component: 'Blogs/index'
  },
  {
    path: blog.createLink,
    name: blog.createName,
    component: 'Blogs/Post/index',
    meta: { layout: 'SinglePostLayout' }
  },
  {
    path: `${blog.createLink}/:slug`,
    name: `${blog.createName}-slug`,
    component: 'Blogs/Post/_slug',
    meta: { layout: 'SinglePostLayout' }
  }
];

const routes = routerOptions.map(route => ({
  ...route,
  component: () => import(`@/views/${route.component}.vue`)
}));

Vue.use(Router);

const base = process.env.NODE_ENV === 'development' ? '/' : '/admin/';

const router = new Router({
  base,
  mode: 'history',
  routes
});

router.beforeEach((to, from, next) => {
  store.commit(LAYOUT, to.meta.layout);

  const isAuthenticated = firebase.auth().currentUser;
  if (isAuthenticated) {
    if (to.path == '/login') {
      next('/');
    } else {
      next();
    }
  } else {
    if (to.path !== '/login') {
      next('login');
    } else {
      next();
    }
  }
});

export default router;
