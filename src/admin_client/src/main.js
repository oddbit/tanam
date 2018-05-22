import '@babel/polyfill';
import Vue from 'vue';
import './plugins/vuetify';
import { store } from '@/store';
import { AUTO_LOGIN } from '@/store/types';
const App = () => import('./App.vue');
import router from './router';
import firebase from 'firebase/app';
import 'firebase/auth';
// import './registerServiceWorker';

Vue.config.productionTip = false;

firebase.initializeApp({
  apiKey: 'AIzaSyD-sz6tSPCKKhQBJnl1SuAzrnMktnMOFSI',
  authDomain: 'tanam-dev.firebaseapp.com',
  databaseURL: 'https://tanam-dev.firebaseio.com',
  projectId: 'tanam-dev',
  storageBucket: 'tanam-dev.appspot.com',
  messagingSenderId: '2622678578'
});

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
