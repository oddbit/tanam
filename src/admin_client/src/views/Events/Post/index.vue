<template>
  <EventDetail />
</template>

<script>
import EventDetail from '@/components/Events/EventDetail';
import { POST_MODE, SET_POST_TO_NULL } from '@/store/types';

export default {
  components: {
    EventDetail
  },
  mounted() {
    this.$store.commit(POST_MODE, 'post');
  },
  beforeDestroy() {
    this.$store.commit(SET_POST_TO_NULL);
  }
};
</script>
