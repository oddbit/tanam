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
        :to="{name: 'contentType', params: {link: type.meta.name}}">
        <v-list-tile-action><v-icon>{{ type.meta.icon }}</v-icon></v-list-tile-action>
        <v-list-tile-title>{{ type.meta.title }}</v-list-tile-title>
      </v-list-tile>
    </v-list>

    <v-list
      subheader>
      <v-subheader>MANAGE</v-subheader>
      <v-list-tile
        ripple
        to="/manage/content-type">
        <v-list-tile-action><v-icon>description</v-icon></v-list-tile-action>
        <v-list-tile-title>Content Type</v-list-tile-title>
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
import { CONTENT_TYPES_GET, MANAGE_CT_CONTENT_TYPES } from '@/store/types';

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
      contentTypes: [MANAGE_CT_CONTENT_TYPES]
    })
  },
  methods: {
    handleClickContentTypeHeader() {
      alert('click');
    },
    handleClickContentTypeAdd() {
      alert('add');
    }
  }
};
</script>
