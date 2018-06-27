<template>
  <div>

    <v-list>
      <v-list-tile
        to="/"
        ripple
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
        to="/events">
        <v-list-tile-action><v-icon>event</v-icon></v-list-tile-action>
        <v-list-tile-title>Events</v-list-tile-title>
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
