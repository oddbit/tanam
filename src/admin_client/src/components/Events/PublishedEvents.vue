<template>
  <Event>
    <template slot="title">{{ publishedEvent.title }}</template>
    <template slot="datetime">{{ publishedEvent.publishedAt | isoDateToDatetime }}</template>
    <template slot="action-menu-item"><PublishedActionMenuItem /></template>
  </Event>
</template>

<script>
import Event from '@/components/Events/Event';
import isoDateToDatetime from '@/helpers/isoDateToDatetime';

export default {
  props: {
    publishedEvent: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    Event,
    PublishedActionMenuItem: () =>
      import('@/components/Events/PublishedActionMenuItem')
  },
  filters: {
    isoDateToDatetime(isodate) {
      return isoDateToDatetime(isodate);
    }
  }
};
</script>
