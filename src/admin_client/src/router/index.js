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
    path: '/manage/pages',
    name: 'templatePages',
    component: 'Manage/Pages/index'
  },
  {
    path: '/manage/pages/post',
    name: 'page-posts',
    component: 'Manage/Pages/Post/index',
    meta: { layout: 'SinglePostLayout' }
  },
  {
    path: `/manage/pages/post/:slug`,
    name: `page-posts-slug`,
    component: 'Manage/Pages/Post/_slug',
    meta: { layout: 'SinglePostLayout' }
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
    name: 'account-settings',
    component: 'Profile/AccountSettings',
    meta: { layout: 'ProfileLayout' }
  },
  {
    path: '/content-type/:link/new',
    name: 'contentTypeNew',
    component: 'ContentType/Post/index',
    props: true,
    meta: { layout: 'SinglePostLayout' }
  },
  {
    path: '/content-type/:link',
    name: 'contentTypeList',
    component: 'ContentType/index',
    props: true
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
