<template>
  <SingleBlog v-if="!loading" post-mode="edit" />
</template>

<script>
import SingleBlog from '@/components/Blog/SingleBlog';
import { GET_BLOG_BY, BLOG_POST_ID } from '@/store/types';

export default {
  data: () => ({
    loading: true
  }),
  components: {
    SingleBlog
  },
  mounted() {
    this.$store.commit(BLOG_POST_ID, this.$route.params.slug);
    this.$store.dispatch(GET_BLOG_BY, this.$route.params.slug).then(() => {
      this.loading = false;
    });
  }
};
</script>
