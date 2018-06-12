<template>
  <v-navigation-drawer
    :value="drawerStatus"
    :clipped="$mq === 'desktop'"
    fixed
    app
    @input="inputDrawer">

    <ProfileDrawer v-if="isProfileRoute" />
    <MainDrawer v-else />

  </v-navigation-drawer>
</template>

<script>
import MainDrawer from '@/components/Drawer/MainDrawer';
import ProfileDrawer from '@/components/Drawer/ProfileDrawer';
import { TOGGLE_DRAWER } from '@/store/types';
import { mapState } from 'vuex';

export default {
  components: {
    MainDrawer,
    ProfileDrawer
  },
  computed: {
    ...mapState({
      drawerStatus(state) {
        if (this.$mq === 'desktop') {
          return true;
        }
        return state.drawer.status;
      }
    }),
    isProfileRoute() {
      return /\/profile/gi.test(this.$route.path);
    }
  },
  methods: {
    inputDrawer(val) {
      if (!val) {
        this.$store.commit(TOGGLE_DRAWER, false);
      }
    }
  }
};
</script>
