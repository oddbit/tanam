<template>
  <div id="app">
    <v-app>
      <div v-if="currentUser">
        <Drawer />
        <Toolbar />
      </div>
      <v-content>
        <router-view />
      </v-content>
    </v-app>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { CURRENT_USER, LOGOUT } from '@/store/types';
import Drawer from '@/components/Drawer/Drawer';
import Toolbar from '@/components/Toolbar';

export default {
  name: 'App',
  components: {
    Drawer,
    Toolbar
  },
  computed: {
    ...mapGetters({
      currentUser: CURRENT_USER
    })
  },
  methods: {
    ...mapActions({
      onLogout: LOGOUT
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
</style>
