<template>
  <div>

    <div class="info-wrapper">
      <span class="img-wrapper">
        <img src="@/assets/images/gravatar.jpg" />
      </span>
      <h2>Ananda Widiprabawa</h2>
      <h4>@anandaprabawa</h4>
      <v-btn color="light-green darken-4" dark>Sign Out</v-btn>
    </div>

    <v-list subheader>
      <v-subheader>PROFILE</v-subheader>
      <v-list-tile
        to="/profile"
        ripple
        @click="() => null"
        active-class="light-green--text text--darken-4">
        <v-list-tile-action><v-icon>person</v-icon></v-list-tile-action>
        <v-list-tile-title>My Profile</v-list-tile-title>
      </v-list-tile>
      <v-list-tile
        to="/profile/account-setting"
        ripple
        @click="() => null"
        active-class="light-green--text text--darken-4">
        <v-list-tile-action><v-icon>settings</v-icon></v-list-tile-action>
        <v-list-tile-title>Account Settings</v-list-tile-title>
      </v-list-tile>
    </v-list>

  </div>
</template>

<style lang="scss" scoped>
.info-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 1em 0;
}
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
