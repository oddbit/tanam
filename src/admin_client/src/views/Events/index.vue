<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <div>
        <v-layout justify-center class="my-4">
          <v-flex xs12 md8>
            <v-btn class="ma-0" color="white" to="/events/post">Create Event <v-icon right>event</v-icon></v-btn>
          </v-flex>
        </v-layout>
        <v-layout justify-center class="my-4">
          <v-flex xs12 md8>
            <v-tabs
              v-model="tabsModel"
              slider-color="primary"
              class="elevation-1"
            >
              <v-tab
                v-for="item in tabItems"
                :key="item"
                :href="`#${item}`"
                ripple
              >
                {{ item }}
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tabsModel" class="mt-3 elevation-1">
              <v-tab-item id="published">
                <PublishedEvents 
                  v-for="event in publishedEvents" 
                  :key="event.key"
                  :published-event="event" />
              </v-tab-item>
              <v-tab-item id="draft">
                <DraftEvents v-for="event in draftEvents" :key="event.key" :draft-event="event" />
              </v-tab-item>
            </v-tabs-items>
          </v-flex>
        </v-layout>
      </div>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import { GET_PUBLISHED_EVENTS, GET_DRAFT_EVENTS } from '@/store/types';

export default {
  components: {
    PublishedEvents: () => import('@/components/Events/PublishedEvents'),
    DraftEvents: () => import('@/components/Events/DraftEvents')
  },
  data: () => ({
    tabItems: ['published', 'draft'],
    tabsModel: 'published',
    publishedEvents: [],
    draftEvents: []
  }),
  mounted() {
    this.$store.dispatch(GET_PUBLISHED_EVENTS).then(snapshot => {
      snapshot.forEach(snap => {
        this.publishedEvents.push({ key: snap.key, ...snap.val() });
      });
    });
    this.$store.dispatch(GET_DRAFT_EVENTS).then(snapshot => {
      snapshot.forEach(snap => {
        this.draftEvents.push({ key: snap.key, ...snap.val() });
      });
    });
  }
};
</script>
