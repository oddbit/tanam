<template>
  <BlogDetail />
</template>

<script>
import BlogDetail from '@/components/Blog/BlogDetail';
import { POST_MODE, SET_POST_TO_NULL } from '@/store/types';

export default {
  components: {
    BlogDetail
  },
  mounted() {
    this.$store.commit(POST_MODE, 'post');
  },
  beforeDestroy() {
    this.$store.commit(SET_POST_TO_NULL);
  }
};
</script>
