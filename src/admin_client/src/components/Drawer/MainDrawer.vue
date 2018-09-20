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

    <v-list
      subheader>
      <v-subheader>CONTENT TYPES</v-subheader>      
      <v-list-tile
        ripple
        v-for="(contentType, index) in dynamicContentTypes"
        :key="index"
        :to="{name: 'contentType', params: {link: `${contentType.permalink}`}}"
        @click="getData(contentType.permalink)">
        <v-list-tile-action><v-icon>{{contentType.icon}}</v-icon></v-list-tile-action>
        <v-list-tile-title>{{contentType.title}}</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { navDrawerLists } from '@/config/navDrawerLists';
import { TEMPLATE_CONTENTTYPES, CONTENTTYPE_POST, CONTENTTYPE_DRAFT } from '@/store/types';

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
  methods: {
    getData(link) {
      this.$store.dispatch(CONTENTTYPE_POST, link);
      this.$store.dispatch(CONTENTTYPE_DRAFT, link);
    }
  },
  mounted() {
    this.$store.dispatch(TEMPLATE_CONTENTTYPES);
  },
  // filters: {
  //   capitalize (title) {
  //     return title.charAt(0).toUpperCase() + title.slice(1)
  //   }
  // },
  computed: {
    ...mapState({
      contentTypes: state => state.templates.contentTypes
    }),
    dynamicContentTypes () {
      const contentTypes = this.$store.state.templates.contentTypes
      var a = Object.keys(contentTypes).map(key => ({
        title: contentTypes[key].title,
        icon: contentTypes[key].icon,
        permalink: contentTypes[key].permalink
      }))
      console.log(a)
      return a
    }
  }
};
</script>
