<template>
  <EventDetail v-if="!loading" mode="edit" />
</template>

<script>
import EventDetail from '@/components/Events/EventDetail';
import { POST_BY, POST_MODE, POST_ID, POST_SET } from '@/store/types';

export default {
  data: () => ({
    loading: true
  }),
  components: {
    EventDetail
  },
  mounted() {
    this.$store.commit(POST_MODE, 'edit');
    this.$store.commit(POST_ID, this.$route.params.slug);
    this.$store
      .dispatch(POST_BY, this.$route.params.slug)
      .then(() => (this.loading = false));
  },
  beforeDestroy() {
    this.$store.commit(POST_SET, null);
  }
};
</script>
