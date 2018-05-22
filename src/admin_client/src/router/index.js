import Vue from 'vue';
import Router from 'vue-router';
import firebase from 'firebase/app';

const routerOptions = [
  {
    path: '/',
    name: 'home',
    component: 'Home'
  },
  {
    path: '/login',
    name: 'login',
    component: 'Login'
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
