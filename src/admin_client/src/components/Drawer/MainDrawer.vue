<template>
  <div>

    <v-list>
      <v-list-tile
        to="/"
        ripple
        active-class="primary--text"
        @click="() => null">
        <v-list-tile-action><v-icon>dashboard</v-icon></v-list-tile-action>
        <v-list-tile-title>Dashboard</v-list-tile-title>
      </v-list-tile>
      <v-list-tile
        ripple
        @click="() => null">
        <v-list-tile-action><v-icon>bar_chart</v-icon></v-list-tile-action>
        <v-list-tile-title>Statistic</v-list-tile-title>
      </v-list-tile>
    </v-list>

    <v-list subheader>
      <v-subheader>MANAGE</v-subheader>
      <v-list-tile
        ripple
        @click="() => null">
        <v-list-tile-action><v-icon>library_books</v-icon></v-list-tile-action>
        <v-list-tile-title>Posts</v-list-tile-title>
      </v-list-tile>
      <v-list-tile
        ripple
        @click="() => null">
        <v-list-tile-action><v-icon>pages</v-icon></v-list-tile-action>
        <v-list-tile-title>Pages</v-list-tile-title>
      </v-list-tile>
      <v-list-tile
        ripple
        @click="() => null">
        <v-list-tile-action><v-icon>perm_media</v-icon></v-list-tile-action>
        <v-list-tile-title>Media</v-list-tile-title>
      </v-list-tile>
      <v-list-tile
        ripple
        @click="() => null">
        <v-list-tile-action><v-icon>comment</v-icon></v-list-tile-action>
        <v-list-tile-title>Comments</v-list-tile-title>
      </v-list-tile>
    </v-list>

    <v-list subheader>
      <v-subheader>SITE</v-subheader>
      <v-list-tile
        ripple
        @click="() => null">
        <v-list-tile-action><v-icon>menu</v-icon></v-list-tile-action>
        <v-list-tile-title>Menu</v-list-tile-title>
      </v-list-tile>
      <v-list-tile
        ripple
        @click="() => null">
        <v-list-tile-action><v-icon>settings</v-icon></v-list-tile-action>
        <v-list-tile-title>Settings</v-list-tile-title>
      </v-list-tile>
    </v-list>

  </div>
</template>
