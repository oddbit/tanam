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
    <v-btn v-if="$mq === 'desktop'" light>
      Publish
    </v-btn>
    <v-btn v-if="$mq === 'mobile'" icon>
      <v-icon>send</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
export default {
  methods: {
    handleToggleEventPostSettings() {
      this.$store.commit('drawer/toggleDrawerEventPost');
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
