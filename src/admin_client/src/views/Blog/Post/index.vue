<template>
  <BlogDetail />
</template>

<script>
import BlogDetail from '@/components/Blog/BlogDetail';
import { POST_MODE, BLOG_SET_POST_TO_NULL } from '@/store/types';

export default {
  components: {
    BlogDetail
  },
  mounted() {
    this.$store.commit(POST_MODE, 'post');
  },
  beforeDestroy() {
    this.$store.commit(BLOG_SET_POST_TO_NULL);
  }
};
</script>
