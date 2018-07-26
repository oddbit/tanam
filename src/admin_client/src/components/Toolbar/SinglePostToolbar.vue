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
    <EventToolbar v-if="contentType === 'event'" />
    <BlogToolbar v-else />
  </v-toolbar>
</template>

<script>
import { TOGGLE_DRAWER_POST, POST_CONTENT_TYPE } from '@/store/types';
import EventToolbar from '@/components/Event/Toolbar';
import BlogToolbar from '@/components/Blog/Toolbar';

export default {
  components: {
    EventToolbar,
    BlogToolbar
  },
  computed: {
    contentType() {
      return this.$store.getters[POST_CONTENT_TYPE];
    }
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
