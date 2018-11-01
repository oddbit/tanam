<template>
  <div>
    <v-btn 
      v-if="$mq === 'desktop'" 
      light 
      @click="handleClickSubmit">
      {{ postMode === 'new' ? 'Publish' : 'Update' }}
    </v-btn>
    <v-btn @click="handleClickSubmit" v-if="$mq === 'mobile'" icon>
      <v-icon>send</v-icon>
    </v-btn>
  </div>
</template>

<script>
import {
  POST_ACTION_UPLOAD,
  POST_MODE,
  POST_ID,
  POST_VALIDATE_TITLE
} from '@/store/types';

export default {
  computed: {
    postMode() {
      return this.$store.getters[POST_MODE];
    },
    isDisableBtnSubmit() {
      return !this.$store.getters[POST_VALIDATE_TITLE];
    }
  },
  methods: {
    async handleClickSubmit() {
      console.log('toolbar click submit');
      this.$store.dispatch(POST_ACTION_UPLOAD);
      const status = this.$store.getters[POST_ACTION_UPLOAD];
      console.log(status);
    }
    // async handleClickSubmit() {
    //   try {
    //     if (this.postMode === 'new') {
    //       await this.$store.dispatch(POST_ACTION_UPLOAD);
    //     } else {
    //       await this.$store.dispatch(
    //         POST_ACTION_UPLOAD,
    //         this.$store.getters[POST_ID]
    //       );
    //       this.$store.commit(POST_ID, null);
    //     }
    //     this.$router.push('/templates/pages');
    //   } catch (error) {
    //     const alertText = this.postMode === 'new' ? 'publish' : 'update';
    //     alert(`Failed to ${alertText}`);
    //   }
    // }
  }
};
</script>
