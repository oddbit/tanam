<template>
  <v-container fluid>
    <v-layout column align-center>
      <v-flex xs12>
        <div class="text-xs-center">
          <v-btn 
            round 
            color="red" 
            dark
            @click.prevent="loginGoogle">Login with Google
            <v-icon right dark>lock_open</v-icon>
            <span slot="loader" class="custom-loader">
              <v-icon light>cached</v-icon>
            </span>
          </v-btn>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { CURRENT_USER, LOGIN_GOOGLE } from '@/store/types';

export default {
  computed: {
    ...mapGetters({
      currentUser: CURRENT_USER
    })
  },
  methods: {
    ...mapActions({
      loginGoogle: LOGIN_GOOGLE
    })
  },
  watch: {
    currentUser(user) {
      if (user !== null && user !== undefined) {
        this.$router.push('/');
      }
    }
  }
};
</script>


<style scoped>
</style>
