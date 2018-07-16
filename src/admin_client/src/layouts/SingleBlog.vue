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
import Drawer from '@/components/Drawer/SingleBlogDrawer';
import Toolbar from '@/components/Toolbar/ToolbarSinglePost';

export default {
  components: {
    Drawer,
    Toolbar
  }
};
</script>
