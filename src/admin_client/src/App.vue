<template>
  <div id="app">
    <component :is="layout" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { CURRENT_LAYOUT } from '@/store/types';
import DefaultLayout from '@/layouts/Default';
import SimpleLayout from '@/layouts/Simple';

export default {
  components: {
    DefaultLayout,
    SimpleLayout
  },
  computed: {
    ...mapGetters({
      layout: CURRENT_LAYOUT
    })
  }
};
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
@media screen and (max-width: 1263px) {
  .mobile-flex {
    display: flex;
  }
  .mobile-justify-center {
    justify-content: center !important;
  }
  .mobile-align-center {
    align-items: center !important;
  }
}
</style>
