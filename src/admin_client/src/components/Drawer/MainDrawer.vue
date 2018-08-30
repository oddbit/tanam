<template>
  <div>
    <v-list>
      <v-list-tile
        to="/"
        ripple>
        <v-list-tile-action><v-icon>dashboard</v-icon></v-list-tile-action>
        <v-list-tile-title>Dashboard</v-list-tile-title>
      </v-list-tile>
    </v-list>

    <v-list
      subheader
      v-for="mainList in mainLists"
      :key="`mainList-${mainList.subheader}`">
      <v-subheader>{{ mainList.subheader }}</v-subheader>
      <v-list-tile
        ripple
        v-for="navDrawerItem in navDrawerLists[mainList.types]"
        :key="`navDrawerItem-${navDrawerItem.title}`"
        :to="navDrawerItem.link">
        <v-list-tile-action><v-icon>{{ navDrawerItem.icon }}</v-icon></v-list-tile-action>
        <v-list-tile-title>{{ navDrawerItem.title }}</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </div>
</template>

<script>
import { navDrawerLists } from '@/config/navDrawerLists';

export default {
  data: () => ({
    mainLists: [
      {
        subheader: 'TEMPLATE',
        types: 'templates'
      },
      {
        subheader: 'POST TYPE',
        types: 'postTypes'
      }
    ],
    navDrawerLists
  })
};
</script>
