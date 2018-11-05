<template>
  <v-navigation-drawer
    :value="isShowDrawer"
    :clipped="$mq === 'desktop'"
    fixed
    right
    app>
    <div class="pa-4">
      <v-switch
        v-if="isEditedMode"
        :label="postStatus ? 'Published' : 'Unpublished'"
        v-model="postStatus"
        hide-details
        color="primary"
        class="my-3"
      />
      <v-textarea
        :value="postPermalink"
        auto-grow
        rows="1"
        label="Permalink"
        disabled
        class="my-3" />
    </div>
  </v-navigation-drawer>
</template>

<script>
import {
  POST_IS_SHOW_DRAWER,
  POST_IS_EDITED_MODE,
  POST_FIELD_PERMALINK,
  POST_FIELD_STATUS
} from '@/store/types';

export default {
  computed: {
    isShowDrawer() {
      return this.$store.getters[POST_IS_SHOW_DRAWER];
    },
    isEditedMode() {
      return this.$store.getters[POST_IS_EDITED_MODE];
    },
    postPermalink() {
      return this.$store.getters[POST_FIELD_PERMALINK];
    },
    postStatus: {
      get() {
        const status = this.$store.getters[POST_FIELD_STATUS];
        return status === 'published' ? true : false;
      },
      set(val) {
        this.$store.commit(
          POST_FIELD_STATUS,
          val ? 'published' : 'unpublished'
        );
      }
    }
  },
  destroyed() {
    this.$store.commit(POST_IS_SHOW_DRAWER, true);
  }
};
</script>
