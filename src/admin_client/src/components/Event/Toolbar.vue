<template>
  <div>
    <div v-if="postMode === 'new'">
      <v-btn v-if="$mq === 'desktop'" light @click="handleClickPublish">
        Publish
      </v-btn>
      <v-btn v-if="$mq === 'mobile'" icon>
        <v-icon>send</v-icon>
      </v-btn>
    </div>
    <div v-if="postMode === 'edit'">
      <v-btn v-if="$mq === 'desktop'" light @click="handleClickUpdate">
        Update
      </v-btn>
      <v-btn v-if="$mq === 'mobile'" icon>
        <v-icon>send</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import {
  POST_ACTION_SUBMIT,
  POST_MODE,
  POST_ACTION_UPDATE,
  POST_ID
} from '@/store/types';
import { event } from '@/config/post';

export default {
  computed: {
    postMode() {
      return this.$store.getters[POST_MODE];
    }
  },
  methods: {
    handleClickPublish() {
      this.$store.dispatch(POST_ACTION_SUBMIT);
      this.$router.push(event.indexLink);
    },
    handleClickUpdate() {
      this.$store
        .dispatch(POST_ACTION_UPDATE, this.$store.getters[POST_ID])
        .then(() => {
          this.$store.commit(POST_ID, null);
          this.$router.push(event.indexLink);
        });
    }
  }
};
</script>
