import Vue from 'vue';
import Router from 'vue-router';
import firebase from 'firebase/app';
import { LAYOUT } from '@/store/types';
import { store } from '@/store';

const routerOptions = [
  {
    path: '/',
    name: 'dashboard',
    component: 'Dashboard'
  },
  {
    path: '/login',
    name: 'login',
    component: 'Login',
    meta: { layout: 'SimpleLayout' }
  },
  {
    path: '/manage/images',
    name: 'templateImages',
    component: 'Manage/Images'
  },
  {
    path: '/manage/page',
    name: 'managePage',
    component: 'Manage/Page'
  },
  {
    path: '/manage/content-type',
    name: 'manageContentType',
    component: 'Manage/ContentType'
  },
  {
    path: '/profile',
    name: 'profile',
    component: 'Profile/MyProfile',
    meta: { layout: 'ProfileLayout' }
  },
  {
    path: '/profile/account-settings',
    name: 'accountSettings',
    component: 'Profile/AccountSettings',
    meta: { layout: 'ProfileLayout' }
  },
  {
    path: '/content-type/:ctKey',
    name: 'postList',
    component: 'ContentType/index',
    props: true
  },
  {
    path: '/content-type/:ctKey/new',
    name: 'postNew',
    component: 'ContentType/Single',
    props: true,
    meta: { layout: 'SinglePostLayout' }
  },
  {
    path: '/content-type/:ctKey/:postID',
    name: 'postEdit',
    component: 'ContentType/Single',
    props: true,
    meta: { layout: 'SinglePostLayout' }
  },
  {
    path: '/configure/theme',
    name: 'configureTheme',
    component: 'Configure/Theme'
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
