<template>
  <EventDetail />
</template>

<script>
import EventDetail from '@/components/Events/EventDetail';
import { POST_MODE, POST_SET } from '@/store/types';

export default {
  components: {
    EventDetail
  },
  mounted() {
    this.$store.commit(POST_MODE, 'post');
  },
  beforeDestroy() {
    this.$store.commit(POST_SET, null);
  }
};
</script>
