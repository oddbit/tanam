<template>
  <v-toolbar
    :dense="$mq === 'desktop'"
    app
    fixed
    clipped-left
    clipped-right
    color="primary"
    dark>
    <v-btn icon @click="$router.back()"><v-icon>close</v-icon></v-btn>
    <v-spacer />
    <v-btn icon @click="handleToggleEventPostSettings">
      <v-icon>settings</v-icon>
    </v-btn>
    <div v-if="postMode === 'post'">
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
  </v-toolbar>
</template>

<script>
import {
  POST_ACTION_SUBMIT,
  POST_MODE,
  POST_ACTION_UPDATE,
  POST_ID,
  TOGGLE_DRAWER_POST
} from '@/store/types';

export default {
  computed: {
    postMode() {
      return this.$store.getters[POST_MODE];
    }
  },
  methods: {
    handleToggleEventPostSettings() {
      this.$store.commit(TOGGLE_DRAWER_POST);
    },
    handleClickPublish() {
      this.$store.dispatch(POST_ACTION_SUBMIT);
      this.$router.push('/events');
    },
    handleClickUpdate() {
      this.$store
        .dispatch(POST_ACTION_UPDATE, this.$store.getters[POST_ID])
        .then(() => {
          this.$store.commit(POST_ID, null);
          this.$router.push('/events');
        });
    }
  }
};
</script>


<style lang="scss" scoped>
.toolbar-title {
  color: #fff;
  text-decoration: none;
  font-weight: 600;
}
</style>
