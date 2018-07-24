<template>
  <BlogIndex />
</template>

<script>
import { POST_CONTENT_TYPE } from '@/store/types';
import BlogIndex from '@/components/Blog/BlogIndex';
import { blog } from '@/config/post';

export default {
  components: {
    BlogIndex
  },
  created() {
    this.$store.commit(POST_CONTENT_TYPE, blog.contentType);
  }
};
</script>
