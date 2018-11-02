<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <v-flex>
          <h1>Images</h1>
        </v-flex>
        <v-container>
          <v-layout row wrap>
            <v-flex v-for="img in images" :key="img" xs3>
              <img 
                :src="img" 
                alt="" 
                width="100%" 
                height="100%">
            </v-flex>
          </v-layout>
        </v-container>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import { TEMPLATE_IMAGES } from '@/store/types';

export default {
  computed: {
    ...mapState({
      images: state => state.templates.images
    })
  },
  mounted() {
    this.$store.dispatch(TEMPLATE_IMAGES);
  }
};
</script>


<style scoped>
</style>
