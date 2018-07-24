<template>
  <SingleEvent v-if="!loading" post-mode="edit" />
</template>

<script>
import SingleEvent from '@/components/Event/SingleEvent';
import { POST_BY, POST_ID } from '@/store/types';

export default {
  data: () => ({
    loading: true
  }),
  components: {
    SingleEvent
  },
  mounted() {
    this.$store.commit(POST_ID, this.$route.params.slug);
    this.$store.dispatch(POST_BY, this.$route.params.slug).then(() => {
      this.loading = false;
    });
  }
};
</script>
