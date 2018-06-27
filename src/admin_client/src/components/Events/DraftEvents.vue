<template>
  <Event>
    <template slot="title">{{ draftEvent.title }}</template>
    <template slot="datetime">{{ draftEvent.createdAt | isoDateToDatetime }}</template>
    <template slot="action-menu-item"><DraftActionMenuItem /></template>
  </Event>
</template>

<script>
import isoDateToDatetime from '@/helpers/isoDateToDatetime';

export default {
  props: {
    draftEvent: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    Event: () => import('@/components/Events/Event'),
    DraftActionMenuItem: () => import('@/components/Events/DraftActionMenuItem')
  },
  filters: {
    isoDateToDatetime(isodate) {
      return isoDateToDatetime(isodate);
    }
  }
};
</script>
