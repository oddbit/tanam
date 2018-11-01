<template>
  <!-- <SinglePost /> -->
  <h1>Pages</h1>
</template>

<script>
// import SinglePost from '@/components/Post/SinglePost';
import {
  POST_MODE,
  POST_RESET_STATE,
  POST_CONTENT_TYPE,
  POST_BY,
  POST_ID
} from '@/store/types';

export default {
  components: {
    // SinglePost
  },
  props: {
    postMode: {
      type: String,
      default: 'new'
    }
  },
  mounted() {
    this.$store.commit(POST_MODE, this.postMode);

    if (this.postMode === 'edit') {
      this.$store.commit(POST_ID, this.$route.params.slug);
      this.$store.dispatch(POST_BY, this.$route.params.slug).then(() => {});
    }
  },
  beforeDestroy() {
    this.$store.commit(POST_RESET_STATE);
  },
  created() {
    this.$store.commit(POST_CONTENT_TYPE, 'pages');
  }
};
</script>
