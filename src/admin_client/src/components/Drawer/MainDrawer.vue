<template>
  <Drawer>
    <template slot="drawer">
      <v-list
        v-for="mainList in mainDrawerList"
        :key="`mainList-${mainList.key}`">
        <div v-if="!mainList.subheader">
          <v-list-tile
            :to="mainList.permalink"
            ripple>
            <v-list-tile-action><v-icon>{{ mainList.icon }}</v-icon></v-list-tile-action>
            <v-list-tile-title>{{ mainList.name }}</v-list-tile-title>
          </v-list-tile>
        </div>
        <div v-else>
          <v-subheader>{{ mainList.subheader }}</v-subheader>
          <div v-if="mainList.key === 'contentTypeList'">
            <v-list-tile
              v-for="list in contentTypes"
              :key="`navDrawerItem-${list.meta.key}`"
              :to="`${mainList.permalink}/${list.meta.key}`"
              ripple>
              <v-list-tile-action><v-icon>{{ list.meta.icon }}</v-icon></v-list-tile-action>
              <v-list-tile-title>{{ list.meta.name }}</v-list-tile-title>
            </v-list-tile>
          </div>
          <div v-else>
            <v-list-tile
              v-for="list in mainList.lists"
              :key="`navDrawerItem-${list.key}`"
              :to="`${mainList.permalink}${list.permalink}`"
              ripple>
              <v-list-tile-action><v-icon>{{ list.icon }}</v-icon></v-list-tile-action>
              <v-list-tile-title>{{ list.name }}</v-list-tile-title>
            </v-list-tile>
          </div>
        </div>
      </v-list>
    </template>
  </Drawer>
</template>

<script>
import { mapGetters } from 'vuex';
import { CONTENT_TYPE_GET } from '@/store/types';
import { mainDrawerList } from '@/config/drawer';
import Drawer from './Drawer';

export default {
  components: { Drawer },
  data: () => ({
    mainDrawerList
  }),
  computed: {
    ...mapGetters({
      contentTypes: [CONTENT_TYPE_GET]
    })
  }
};
</script>
