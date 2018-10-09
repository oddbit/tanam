<template>
  <post-index :ct-key="ctKey">
    <template slot="published">
      <post-list
        v-for="(post, index) in published"
        :key="index"
        :link="post.data.link"
        :content-title="post.data.title"
        :time="post.updateTime"
        :status="post.status" />
    </template>
    <template slot="draft">
      <post-list
        v-for="(post, index) in unpublished"
        :key="index"
        :link="post.data.link"
        :content-title="post.data.title"
        :time="post.updateTime"
        :status="post.status" />
    </template>
  </post-index>
</template>

<script>
import PostIndex from '@/components/Post/PostIndex';
import PostList from '@/components/Post/PostList';
import { CONTENTTYPE_POST, CONTENTTYPE_DRAFT } from '@/store/types';

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
      return this.$store.getters[CONTENTTYPE_POST];
    },
    unpublished() {
      return this.$store.getters[CONTENTTYPE_DRAFT];
    }
  },
  watch: {
    ctKey() {
      this.$store.dispatch(CONTENTTYPE_POST, this.ctKey);
      this.$store.dispatch(CONTENTTYPE_DRAFT, this.ctKey);
    }
  },
  mounted() {
    this.$store.dispatch(CONTENTTYPE_POST, this.ctKey);
    this.$store.dispatch(CONTENTTYPE_DRAFT, this.ctKey);
  }
};
</script>
