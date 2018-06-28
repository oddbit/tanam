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
                <PublishedEvents />
              </v-tab-item>
              <v-tab-item id="draft">
                <DraftEvents />
              </v-tab-item>
            </v-tabs-items>
          </v-flex>
        </v-layout>
      </div>
    </v-slide-y-transition>
    <DialogDelete />
  </v-container>
</template>

<script>
export default {
  components: {
    PublishedEvents: () => import('@/components/Events/PublishedEvents'),
    DraftEvents: () => import('@/components/Events/DraftEvents'),
    DialogDelete: () => import('@/components/Events/DialogDelete')
  },
  data: () => ({
    tabItems: ['published', 'draft'],
    tabsModel: 'published'
  })
};
</script>
