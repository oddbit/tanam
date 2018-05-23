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
    <v-menu 
      class="ml-2 mr-4"
      left 
      bottom
      offset-y
      nudge-top="-10"
      max-width="85%"
      light>
      <span
        slot="activator"
        class="toolbar-avatar">
        <img src="@/assets/images/gravatar.jpg">
      </span>
      <v-layout class="menu-layout-wrapper" column>
        <v-layout class="pa-3">
          <span class="img-wrapper"><img src="@/assets/images/gravatar.jpg"></span>
          <div class="ml-3 text-xs-left user">
            <h4>I Made Ananda Widiprabawa</h4>
            <p>ananda.widiprabawa@gmail.com</p>
          </div>
        </v-layout>
        <v-layout class="px-2 py-1 grey lighten-3" justify-space-between>
          <v-btn @click="$router.push('/profile')" color="primary">My Profile</v-btn>
          <v-btn @click="handleLogout">Logout</v-btn>
        </v-layout>
      </v-layout>
    </v-menu>
  </v-toolbar>
</template>

<script>
import { mapActions } from 'vuex';
import { LOGOUT } from '@/store/types';

export default {
  computed: {
    isProfileRoute() {
      return /\/profile/gi.test(this.$route.path);
    }
  },
  methods: {
    ...mapActions({
      handleLogout: LOGOUT
    }),
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
  img {
    max-width: 100%;
    border-radius: 100%;
    object-fit: cover;
  }
}
.menu-layout-wrapper {
  background: #fff;
  min-width: 250px;
  .img-wrapper {
    width: 80px;
    display: flex;
    align-items: center;
    img {
      max-width: 100%;
      border-radius: 100%;
      object-fit: cover;
    }
  }
  .user {
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    h4,
    p {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    p {
      margin-bottom: 0;
    }
  }
}
</style>
