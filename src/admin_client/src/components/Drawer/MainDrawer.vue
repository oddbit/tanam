<template>
  <Drawer>
    <template slot="drawer">
      <div class="head-wrapper elevation-8">
        <router-link to="/" class="title-logo">
          <img src="@/assets/images/tanam-icon.svg" alt="" srcset="">
          <span>TANAM</span>
        </router-link>
      </div>
      <div class="list-wrapper">
        <v-list
          v-for="mainList in mainDrawerList"
          :key="`mainList-${mainList.key}`"
          :class="mainList.class" 
          dark
          class="list-bg">
          <div v-if="!mainList.subheader">
            <v-list-tile
              :to="mainList.permalink"
              ripple 
              color="#bbb"
              class="list-tile">
              <v-list-tile-action class="action"><v-icon class="icon">{{ mainList.icon }}</v-icon></v-list-tile-action>
              <v-list-tile-title class="title">{{ mainList.name }}</v-list-tile-title>
            </v-list-tile>
          </div>
          <div v-else>
            <v-subheader>{{ mainList.subheader }}</v-subheader>
            <div v-if="mainList.key === 'contentTypeList'">
              <v-list-tile
                v-for="list in contentTypes"
                :key="`navDrawerItem-${list.meta.key}`"
                :to="`${mainList.permalink}/${list.meta.key}`"
                ripple 
                color="#bbb"
                class="list-tile">
                <v-list-tile-action class="action"><v-icon class="icon">{{ list.meta.icon }}</v-icon></v-list-tile-action>
                <v-list-tile-title class="title">{{ list.meta.name }}</v-list-tile-title>
              </v-list-tile>
            </div>
            <div v-else>
              <v-list-tile
                v-for="list in mainList.lists"
                :key="`navDrawerItem-${list.key}`"
                :to="`${mainList.permalink}${list.permalink}`"
                ripple 
                color="#bbb"
                class="list-tile">
                <v-list-tile-action class="action"><v-icon class="icon">{{ list.icon }}</v-icon></v-list-tile-action>
                <v-list-tile-title class="title">{{ list.name }}</v-list-tile-title>
              </v-list-tile>
            </div>
          </div>
        </v-list>
      </div>
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

<style lang="scss" scoped>
.head-wrapper {
  display: flex;
  align-items: center;
  padding: 0 24px;
  height: 48px;
  background: #333;
  border-bottom: 1px solid #444;
  .title-logo {
    color: #fff;
    font-weight: bold;
    text-decoration: none;
    display: flex;
    align-items: center;

    img {
      max-width: 100%;
      max-height: 28px;
    }

    span {
      margin-left: 16px;
      font-size: 18px;
      font-weight: 500;
    }
  }
}

.list-wrapper {
  overflow-y: auto;
  background: #222;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 8px;
    border: 2px solid #333;
  }
  &::-webkit-scrollbar {
    width: 8px;
    background: #333;
  }
}

.list-bg {
  background: #222 !important;

  .action {
    min-width: 40px;
    .icon {
      font-size: 22px;
    }
  }

  .title {
    font-weight: 500;
    font-size: 14px !important;
    display: flex;
    align-items: center;
  }
}

.dashboard {
  background: #333 !important;
  border-bottom: 1px solid #444;
  padding: 0;
}
</style>

<style lang="scss">
.list-wrapper {
  .v-subheader {
    padding: 0 24px;
    color: #fff;
    font-size: 15px;
    font-weight: 500;
  }

  :not(.v-list__tile--active) {
    .icon {
      color: #bbb;
    }
  }
}
.list-tile {
  a {
    height: 40px;
    padding: 0 24px;
  }
}
.dashboard {
  .list-tile {
    a {
      height: 48px;
    }
  }
}
</style>
