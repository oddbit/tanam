<template>
  <div>
    <div v-for="event in draftEvents" :key="event.key">
      <Event :link-to="event.key">
        <template slot="title">{{ event.title }}</template>
        <template slot="datetime">{{ event.createdAt | isoDateToDatetime }}</template>
        <template slot="action-menu-item"><DraftActionMenuItem /></template>
      </Event>
    </div>
  </div>
</template>

<script>
import { POST_DRAFT } from '@/store/types';
import Event from '@/components/Events/Event';
import isoDateToDatetime from '@/helpers/isoDateToDatetime';

export default {
  components: {
    Event,
    DraftActionMenuItem: () => import('@/components/Events/DraftActionMenuItem')
  },
  filters: {
    isoDateToDatetime(isodate) {
      return isoDateToDatetime(isodate);
    }
  },
  computed: {
    draftEvents() {
      return this.$store.getters[POST_DRAFT];
    }
  },
  mounted() {
    this.$store.dispatch(POST_DRAFT);
  }
};
</script>
