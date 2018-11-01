<template>
  <v-app>
    <Drawer />
    <Toolbar />
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import Drawer from '@/components/Drawer/ProfileDrawer';
import Toolbar from '@/components/Toolbar/MainToolbar';

export default {
  components: {
    Drawer,
    Toolbar
  }
};
</script>
