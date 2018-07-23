<template>
  <SinglePost />
</template>

<script>
import SinglePost from '@/components/Post/SinglePost';
import { POST_MODE, POST_SET } from '@/store/types';

export default {
  components: {
    SinglePost
  },
  mounted() {
    this.$store.commit(POST_MODE, 'post');
  },
  beforeDestroy() {
    this.$store.commit(POST_SET, null);
  }
};
</script>
