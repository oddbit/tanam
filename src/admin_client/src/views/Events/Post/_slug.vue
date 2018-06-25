<template>
  <EventDetail v-if="!loading" mode="edit" />
</template>

<script>
import EventDetail from '@/components/Events/EventDetail';
import {
  GET_EVENT_BY,
  POST_MODE,
  POST_ID,
  SET_POST_TO_NULL
} from '@/store/types';

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
      .dispatch(GET_EVENT_BY, this.$route.params.slug)
      .then(() => (this.loading = false));
  },
  beforeDestroy() {
    this.$store.commit(SET_POST_TO_NULL);
  }
};
</script>
