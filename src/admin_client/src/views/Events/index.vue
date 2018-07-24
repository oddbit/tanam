<template>
  <EventIndex />
</template>

<script>
import { POST_CONTENT_TYPE } from '@/store/types';
import EventIndex from '@/components/Event/EventIndex';
import { event } from '@/config/post';

export default {
  components: {
    EventIndex
  },
  created() {
    this.$store.commit(POST_CONTENT_TYPE, event.contentType);
  }
};
</script>
