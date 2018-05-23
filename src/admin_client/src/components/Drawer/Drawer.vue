<template>
  <v-navigation-drawer clipped fixed app>

    <MainDrawer v-if="$route.path === '/'"/>
    <ProfileDrawer v-else-if="$route.path === '/profile'"/>

  </v-navigation-drawer>
</template>

<script>
import MainDrawer from '@/components/Drawer/MainDrawer';
import ProfileDrawer from '@/components/Drawer/ProfileDrawer';

export default {
  components: {
    MainDrawer,
    ProfileDrawer,
  },
};
</script>
