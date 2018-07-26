<template>
  <Draft :posts="posts" />
</template>

<script>
import Draft from '@/components/Post/Draft';
import { POST_DRAFT } from '@/store/types';

export default {
  components: {
    Draft
  },
  computed: {
    posts() {
      return this.$store.getters[POST_DRAFT];
    }
  },
  mounted() {
    this.$store.dispatch(POST_DRAFT);
  }
};
</script>
