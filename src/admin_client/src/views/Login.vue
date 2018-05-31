<template>
  <v-container fluid fill-height class="primary">
    <v-layout column align-center justify-center>
      <v-flex xs12 d-flex align-center>
        <v-card flat color="transparent" class="text-xs-center">
          <div class="head-wrapper mb-4">
            <div class="logo-wrapper pa-1 mb-2">
              <img src="@/assets/images/tanam-circle.png">
            </div>
            <h2 class="white--text head-title">Welcome to Tanam<span>CMS</span></h2>
          </div>
          <v-btn
            color="white"
            light
            class="btn-wrapper"
            @click.prevent="loginGoogle">
            <span class="img-wrapper">
              <img src="@/assets/images/google-icon-color.svg">
            </span>
            <span class="text pl-3 grey--text text--darken-3">Sign in with Google</span>
            <span slot="loader" class="custom-loader">
              <v-icon light>cached</v-icon>
            </span>
          </v-btn>
        </v-card>
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

<style lang="scss" scoped>
.head-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .logo-wrapper {
    display: flex;
    align-items: center;
    border: 2px solid #fff;
    border-radius: 100%;
    img {
      max-width: 100px;
    }
  }
  .head-title {
    font-weight: 400;
    span {
      font-weight: 700;
    }
  }
}
.btn-wrapper {
  .img-wrapper {
    display: flex;
    align-items: center;
    img {
      width: 18px;
      height: 18px;
      vertical-align: middle;
    }
  }
  .text {
    text-transform: initial;
  }
}
</style>
