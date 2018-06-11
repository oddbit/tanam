import '@babel/polyfill';
import Vue from 'vue';
import './plugins/vuetify';
import './plugins/vueMq';
import './plugins/vueCropper';
import { store } from '@/store';
import { AUTO_LOGIN } from '@/store/types';
const App = () => import('./App.vue');
import router from './router';
import firebase from 'firebase/app';
import 'firebase/auth';
import '@/utils/firebase';
// import './registerServiceWorker';

Vue.config.productionTip = false;

const unsubscribe = firebase.auth().onAuthStateChanged(user => {
  new Vue({
    router,
    store,
    render: h => h(App),
    created() {
      if (user) {
        store.dispatch(AUTO_LOGIN, user);
      }
    }
  }).$mount('#app');
  unsubscribe();
});
