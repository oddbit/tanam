<template>
  <v-app>
    <drawer />
    <toolbar />
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import Toolbar from '@/components/Toolbar/SinglePostToolbar';
import Drawer from '@/components/Post/Drawer';

export default {
  components: {
    Toolbar,
    Drawer
  }
};
</script>
