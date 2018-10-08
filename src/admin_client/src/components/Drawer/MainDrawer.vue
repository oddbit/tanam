<template>
  <Drawer>
    <template slot="drawer">
      <v-list
        v-for="mainList in mainDrawerList"
        :key="`mainList-${mainList.name}`">
        <div v-if="!mainList.subheader">
          <v-list-tile
            ripple
            :to="mainList.permalink">
            <v-list-tile-action><v-icon>{{ mainList.icon }}</v-icon></v-list-tile-action>
            <v-list-tile-title>{{ mainList.title }}</v-list-tile-title>
          </v-list-tile>
        </div>
        <div v-else>
          <v-subheader>{{ mainList.subheader }}</v-subheader>
          <div v-if="mainList.name === 'contentTypeList'">
            <v-list-tile
              ripple
              v-for="list in contentTypes"
              :key="`navDrawerItem-${list.meta.name}`"
              :to="`${mainList.permalink}/${list.meta.name}`">
              <v-list-tile-action><v-icon>{{ list.meta.icon }}</v-icon></v-list-tile-action>
              <v-list-tile-title>{{ list.meta.title }}</v-list-tile-title>
            </v-list-tile>
          </div>
          <div v-else>
            <v-list-tile
              ripple
              v-for="list in mainList.lists"
              :key="`navDrawerItem-${list.name}`"
              :to="`${mainList.permalink}${list.permalink}`">
              <v-list-tile-action><v-icon>{{ list.icon }}</v-icon></v-list-tile-action>
              <v-list-tile-title>{{ list.title }}</v-list-tile-title>
            </v-list-tile>
          </div>
        </div>
      </v-list>
    </template>
  </Drawer>
</template>

<script>
import { mapGetters } from 'vuex';
import { MANAGE_CT_CONTENT_TYPES } from '@/store/types';
import { mainDrawerList } from '@/config/drawer';
import Drawer from './Drawer';

export default {
  components: { Drawer },
  data: () => ({
    mainDrawerList
  }),
  computed: {
    ...mapGetters({
      contentTypes: [MANAGE_CT_CONTENT_TYPES]
    })
  }
};
</script>
