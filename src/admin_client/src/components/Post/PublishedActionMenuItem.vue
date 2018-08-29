<template>
  <div>
    <v-list-tile 
      v-for="item in listAction" 
      :key="item.name" 
      @click="handleClickActionItem(item.name)"
      ripple>
      <v-icon class="action-icon">{{ item.icon }}</v-icon>
      <v-list-tile-title>{{ item.text }}</v-list-tile-title>
    </v-list-tile>
  </div>
</template>

<script>
import {
  POST_DIALOG_DELETE,
  POST_ID,
  POST_CONTENT_TYPE,
  POST_FIELD_FEATURED_IMAGE
} from '@/store/types';
import { blog, event } from '@/config/post';

export default {
  props: {
    postId: {
      type: String,
      default: null
    },
    postFeaturedImage: {
      type: String,
      default: null
    }
  },
  data: () => ({
    listAction: [
      { name: 'edit', text: 'Edit', icon: 'edit' },
      { name: 'delete', text: 'Delete', icon: 'delete' }
    ]
  }),
  computed: {
    contentType() {
      return this.$store.getters[POST_CONTENT_TYPE];
    }
  },
  methods: {
    handleClickActionItem(name) {
      switch (name) {
        case 'edit':
          this.$router.push(
            `${
              this.contentType === 'event' ? event.createLink : blog.createLink
            }/` + this.postId
          );
          break;
        case 'delete':
          this.$store.commit(POST_ID, this.postId);
          this.$store.commit(POST_FIELD_FEATURED_IMAGE, {
            src: this.postFeaturedImage,
            dataUri: false
          });
          this.$store.commit(POST_DIALOG_DELETE, true);
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.action-icon {
  margin-right: 8px;
}
</style>
