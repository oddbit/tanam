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
import Drawer from '@/components/Drawer/SinglePostDrawer';
import Toolbar from '@/components/Toolbar/SinglePostToolbar';

export default {
  components: {
    Drawer,
    Toolbar
  }
};
</script>
