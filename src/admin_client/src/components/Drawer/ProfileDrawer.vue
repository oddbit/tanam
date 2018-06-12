<template>
  <div>

    <v-layout 
      justify-center 
      align-center 
      column 
      class="my-4">
      <span class="img-wrapper">
        <img src="@/assets/images/gravatar.jpg">
      </span>
      <h2 class="mt-2">Ananda Widiprabawa</h2>
      <h4>@anandaprabawa</h4>
      <v-btn
        @click="handleLogout"
        color="primary"
        dark
        class="mt-3">Logout</v-btn>
    </v-layout>

    <v-list subheader>
      <v-subheader>PROFILE</v-subheader>
      <v-list-tile
        to="/profile"
        exact
        ripple
        active-class="primary--text"
        @click="() => null">
        <v-list-tile-action><v-icon>person</v-icon></v-list-tile-action>
        <v-list-tile-title>My Profile</v-list-tile-title>
      </v-list-tile>
      <v-list-tile
        to="/profile/account-settings"
        exact
        ripple
        active-class="primary--text"
        @click="() => null">
        <v-list-tile-action><v-icon>settings</v-icon></v-list-tile-action>
        <v-list-tile-title>Account Settings</v-list-tile-title>
      </v-list-tile>
    </v-list>

  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { LOGOUT } from '@/store/types';

export default {
  methods: {
    ...mapActions({
      handleLogout: LOGOUT
    })
  }
};
</script>


<style lang="scss" scoped>
.img-wrapper {
  width: 50%;
  display: flex;
  align-items: center;
  img {
    max-width: 100%;
    border-radius: 100%;
  }
}
</style>
