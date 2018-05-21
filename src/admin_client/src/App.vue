<template>
  <div id="app">
    <v-app>
      <Drawer/>
      <Toolbar/>
      <v-content>
        <router-view/>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import Drawer from '@/components/Drawer/Drawer';
import Toolbar from '@/components/Toolbar';

export default {
  name: 'App',
  components: {
    Drawer,
    Toolbar,
  },
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
