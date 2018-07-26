<template>
  <Published :posts="posts" />
</template>

<script>
import Published from '@/components/Post/Published';
import { POST_PUBLISHED } from '@/store/types';

export default {
  components: {
    Published
  },
  computed: {
    posts() {
      return this.$store.getters[POST_PUBLISHED];
    }
  },
  mounted() {
    this.$store.dispatch(POST_PUBLISHED);
  }
};
</script>
