<template>
  <div>
    <div v-for="event in publishedEvents" :key="event.key">
      <Event :link-to="event.key">
        <template slot="title">{{ event.title }}</template>
        <template slot="datetime">{{ event.publishedAt | isoDateToDatetime }}</template>
        <template slot="action-menu-item"><PublishedActionMenuItem :post-id="event.key" /></template>
      </Event>
    </div>
  </div>
</template>

<script>
import { POST_PUBLISHED } from '@/store/types';
import Event from '@/components/Events/Event';
import isoDateToDatetime from '@/helpers/isoDateToDatetime';

export default {
  components: {
    Event,
    PublishedActionMenuItem: () =>
      import('@/components/Events/PublishedActionMenuItem')
  },
  filters: {
    isoDateToDatetime(isodate) {
      return isoDateToDatetime(isodate);
    }
  },
  computed: {
    publishedEvents() {
      return this.$store.getters[POST_PUBLISHED];
    }
  },
  mounted() {
    this.$store.dispatch(POST_PUBLISHED);
  }
};
</script>
