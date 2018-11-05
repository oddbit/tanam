<template>
  <post-index :ct-key="ctKey">
    <template slot="published">
      <post-list
        v-for="post in published"
        :key="post.key"
        :ct-key="ctKey"
        :post-id="post.key"
        :content-title="post.data.title"
        :time="post.updateTime"
        :status="post.status" />
    </template>
    <template slot="unpublished">
      <post-list
        v-for="post in unpublished"
        :key="post.key"
        :ct-key="ctKey"
        :post-id="post.key"
        :content-title="post.data.title"
        :time="post.updateTime"
        :status="post.status" />
    </template>
  </post-index>
</template>

<script>
import PostIndex from '@/components/Post/PostIndex';
import PostList from '@/components/Post/PostList';
import { POST_PUBLISHED, POST_UNPUBLISHED } from '@/store/types';

export default {
  components: {
    PostIndex,
    PostList
  },
  props: {
    ctKey: {
      type: String,
      default: 'name'
    }
  },
  computed: {
    published() {
      return this.$store.getters[POST_PUBLISHED];
    },
    unpublished() {
      return this.$store.getters[POST_UNPUBLISHED];
    }
  },
  watch: {
    ctKey() {
      this.$store.dispatch(POST_PUBLISHED, this.ctKey);
      this.$store.dispatch(POST_UNPUBLISHED, this.ctKey);
    }
  },
  mounted() {
    this.$store.dispatch(POST_PUBLISHED, this.ctKey);
    this.$store.dispatch(POST_UNPUBLISHED, this.ctKey);
  }
};
</script>
