import Vue from 'vue';
import './plugins/vuetify';
import './plugins/vueMq';
import './plugins/vueCropper';
import { store } from '@/store';
import {
  AUTO_LOGIN,
  CONTENT_TYPES_GET,
  MANAGE_CT_CONTENT_TYPES
} from '@/store/types';
const App = () => import('./App.vue');
import router from './router';
import firebase from 'firebase/app';
import 'firebase/auth';
// import './registerServiceWorker';

Vue.config.productionTip = false;

const unsubscribe = firebase.auth().onAuthStateChanged(user => {
  new Vue({
    router,
    store,
    render: h => h(App),
    created() {
      if (user) {
        store.dispatch(AUTO_LOGIN, user).then(() => {
          store.dispatch(CONTENT_TYPES_GET);
          store.dispatch(MANAGE_CT_CONTENT_TYPES);
        });
        // .then(() => router.push('/authenticate'));
      }
    }
  }).$mount('#app');
  unsubscribe();
});
