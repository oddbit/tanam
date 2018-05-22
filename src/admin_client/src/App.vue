<template>
  <v-app>
    <div v-if="currentUser">
      <v-navigation-drawer
        temporary
        v-model="drawer"
        fixed
        app
      >
        <v-list>
          <v-list-tile
            value="true"
            v-for="(item, i) in items"
            :key="i"
            :to="item.to"
          >
            <v-list-tile-action>
              <v-icon v-html="item.icon" />
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="item.title" />
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar app light>
        <!-- <v-toolbar-side-icon @click.stop="drawer = !drawer" /> -->
        <v-toolbar-title v-text="title" to="/" />
        <v-spacer />
        <v-toolbar-items>
          <v-btn flat to="/">Home</v-btn>
          <v-btn
            flat
            @click="onLogout">
            <v-icon left dark>exit_to_app</v-icon>
            Logout
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </div>
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { CURRENT_USER, LOGOUT } from '@/store/types';

export default {
  name: 'App',
  data() {
    return {
      drawer: false,
      items: [],
      title: 'Tanam Admin'
    };
  },
  computed: {
    ...mapGetters({
      currentUser: CURRENT_USER
    })
  },
  methods: {
    ...mapActions({
      onLogout: LOGOUT
    })
  }
};
</script>
