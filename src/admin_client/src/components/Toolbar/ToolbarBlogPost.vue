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
  BLOG_POST_SUBMIT,
  POST_MODE,
  BLOG_POST_UPDATE,
  BLOG_POST_ID
} from '@/store/types';

export default {
  computed: {
    postMode() {
      return this.$store.getters[POST_MODE];
    }
  },
  methods: {
    handleToggleEventPostSettings() {
      this.$store.commit('drawer/toggleDrawerEventPost');
    },
    handleClickPublish() {
      this.$store.dispatch(BLOG_POST_SUBMIT);
      this.$router.push('/blog');
    },
    handleClickUpdate() {
      this.$store.dispatch(BLOG_POST_UPDATE, this.$store.getters[BLOG_POST_ID]);
      this.$store.commit(BLOG_POST_ID, null);
      this.$router.push('/blog');
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
