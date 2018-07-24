<template>
  <SinglePost />
</template>

<script>
import SinglePost from '@/components/Post/SinglePost';
import { POST_MODE, POST_SET_POSTS } from '@/store/types';

export default {
  props: {
    postMode: {
      type: String,
      default: 'new'
    }
  },
  components: {
    SinglePost
  },
  mounted() {
    this.$store.commit(POST_MODE, this.postMode);
  },
  beforeDestroy() {
    this.$store.commit(POST_SET_POSTS, null);
  }
};
</script>
