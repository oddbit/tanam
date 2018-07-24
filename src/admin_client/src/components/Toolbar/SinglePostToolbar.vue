<template>
  <v-toolbar
    :dense="$mq === 'desktop'"
    app
    fixed
    clipped-left
    clipped-right
    color="primary"
    dark>
    <v-btn icon @click="$router.back()"><v-icon>close</v-icon></v-btn>
    <v-spacer />
    <v-btn icon @click="handleToggleEventPostSettings">
      <v-icon>settings</v-icon>
    </v-btn>
    <EventToolbar />
  </v-toolbar>
</template>

<script>
import { TOGGLE_DRAWER_POST } from '@/store/types';
import EventToolbar from '@/components/Event/Toolbar';

export default {
  components: {
    EventToolbar
  },
  methods: {
    handleToggleEventPostSettings() {
      this.$store.commit(TOGGLE_DRAWER_POST);
    }
  }
};
</script>


<style lang="scss" scoped>
.toolbar-title {
  color: #fff;
  text-decoration: none;
  font-weight: 600;
}
</style>
