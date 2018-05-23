<template>
  <v-toolbar
    :dense="$mq === 'desktop'"
    app
    fixed
    clipped-left
    color="primary"
    dark>
    <v-toolbar-side-icon
      v-if="$mq === 'mobile'"
      @click="handleClickMenu" />
    <v-toolbar-title v-if="$mq === 'desktop'"><router-link
      to="/"
      class="toolbar-title">TANAM</router-link></v-toolbar-title>
    <v-spacer />
    <v-btn
      v-if="isProfileRoute"
      icon
      to="/">
      <v-icon>dashboard</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>notifications</v-icon>
    </v-btn>
    <span
      class="toolbar-avatar"
      @click="$router.push('/profile')">
      <img src="@/assets/images/gravatar.jpg">
    </span>
  </v-toolbar>
</template>

<script>
export default {
  computed: {
    isProfileRoute() {
      return /\/profile/gi.test(this.$route.path);
    }
  },
  methods: {
    handleClickMenu() {
      this.$store.commit('drawer/toggleDrawer', true);
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
.toolbar-avatar {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 8px;
  img {
    max-width: 100%;
    border-radius: 100%;
    object-fit: cover;
  }
}
</style>
