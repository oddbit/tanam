<template>
  <v-app>
    <Toolbar />
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import Toolbar from '@/components/Toolbar/SinglePostToolbar';

export default {
  components: {
    Toolbar
  }
};
</script>
