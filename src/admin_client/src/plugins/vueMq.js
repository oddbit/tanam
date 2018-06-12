import Vue from 'vue';
import VueMq from 'vue-mq';

Vue.use(VueMq, {
  breakpoints: {
    mobile: 1264,
    desktop: Infinity
  }
});
