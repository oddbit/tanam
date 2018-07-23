<template>
  <BlogDetail v-if="!loading" mode="edit" />
</template>

<script>
import BlogDetail from '@/components/Blog/BlogDetail';
import {
  GET_BLOG_BY,
  POST_MODE,
  BLOG_POST_ID,
  BLOG_SET_POST_TO_NULL
} from '@/store/types';

export default {
  data: () => ({
    loading: true
  }),
  components: {
    BlogDetail
  },
  mounted() {
    this.$store.commit(POST_MODE, 'edit');
    this.$store.commit(BLOG_POST_ID, this.$route.params.slug);
    this.$store
      .dispatch(GET_BLOG_BY, this.$route.params.slug)
      .then(() => (this.loading = false));
  },
  beforeDestroy() {
    this.$store.commit(BLOG_SET_POST_TO_NULL);
  }
};
</script>
