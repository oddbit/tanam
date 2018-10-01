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
      subheader>
      <v-subheader>CONTENT TYPES</v-subheader>      
      <v-list-tile
        ripple
        v-for="type in contentTypes"
        :key="type.meta.title"
        :to="{name: 'contentType', params: {link: type.meta.permalink}}">
        <v-list-tile-action><v-icon>{{ type.meta.icon }}</v-icon></v-list-tile-action>
        <v-list-tile-title>{{ type.meta.title }}</v-list-tile-title>
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
import { mapGetters } from 'vuex';
import { navDrawerLists } from '@/config/navDrawerLists';
import { CONTENT_TYPES_GET } from '@/store/types';

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
  }),
  computed: {
    ...mapGetters({
      contentTypes: [CONTENT_TYPES_GET]
    })
  }
};
</script>
