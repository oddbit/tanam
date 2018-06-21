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
    <v-btn v-if="$mq === 'desktop'" light @click="handleClickPublish">
      Publish
    </v-btn>
    <v-btn v-if="$mq === 'mobile'" icon>
      <v-icon>send</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
import { EVENT_POST_SUBMIT } from '@/store/types';

export default {
  methods: {
    handleToggleEventPostSettings() {
      this.$store.commit('drawer/toggleDrawerEventPost');
    },
    handleClickPublish() {
      this.$store.dispatch(EVENT_POST_SUBMIT);
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
