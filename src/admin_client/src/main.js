import Vue from 'vue';
import './plugins/vuetify';
import './plugins/vueMq';
import './plugins/vueCropper';
import { store } from '@/store';
import { AUTO_LOGIN, CONTENT_TYPE_GET } from '@/store/types';
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
    created() {
      if (user) {
        store.dispatch(AUTO_LOGIN, user).then(() => {
          store.dispatch(CONTENT_TYPE_GET);
        });
        // .then(() => router.push('/authenticate'));
      }
    },
    render: h => h(App)
  }).$mount('#app');
  unsubscribe();
});
