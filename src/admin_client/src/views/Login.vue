<template>
  <v-container fluid>
    <v-layout column align-center>
      <v-flex xs12>
        <div class="text-xs-center" id="firebaseui-container" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import { CURRENT_USER } from '@/store/types';
import firebase from 'firebase/app';
import { firebaseUI } from '@/utils/firebase';

const uiConfig = {
  signInSuccessUrl: '/',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  tosUrl: '/#tos',
  signInFlow: 'popup'
};

export default {
  mounted() {
    firebaseUI.start('#firebaseui-container', uiConfig);
  },
  computed: {
    ...mapGetters({
      currentUser: CURRENT_USER
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

<style src="firebaseui/dist/firebaseui.css">
</style>
