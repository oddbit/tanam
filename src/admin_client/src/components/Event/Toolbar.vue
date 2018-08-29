<template>
  <div>
    <div v-if="postMode === 'new'">
      <v-btn 
        v-if="$mq === 'desktop'" 
        light 
        @click="handleClickPublish" 
        :disabled="isDisableBtnSubmit">
        Publish
      </v-btn>
      <v-btn v-if="$mq === 'mobile'" icon :disabled="isDisableBtnSubmit">
        <v-icon>send</v-icon>
      </v-btn>
    </div>
    <div v-if="postMode === 'edit'">
      <v-btn 
        v-if="$mq === 'desktop'" 
        light 
        @click="handleClickUpdate" 
        :disabled="isDisableBtnSubmit">
        Update
      </v-btn>
      <v-btn v-if="$mq === 'mobile'" icon :disabled="isDisableBtnSubmit">
        <v-icon>send</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import {
  POST_ACTION_UPLOAD,
  POST_MODE,
  POST_ACTION_UPDATE,
  POST_ID,
  POST_VALIDATE_TITLE
} from '@/store/types';
import { event } from '@/config/post';

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
    async handleClickPublish() {
      try {
        await this.$store.dispatch(POST_ACTION_UPLOAD);
        this.$router.push(event.indexLink);
      } catch (error) {
        alert('Failed to publish');
      }
    },
    async handleClickUpdate() {
      try {
        await this.$store.dispatch(
          POST_ACTION_UPDATE,
          this.$store.getters[POST_ID]
        );
        this.$store.commit(POST_ID, null);
        this.$router.push(event.indexLink);
      } catch (error) {
        alert('Failed to update');
      }
    }
  }
};
</script>
