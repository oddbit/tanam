<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
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
              <Event v-for="n in 3" :key="n" id="published" />
            </v-tab-item>
            <v-tab-item id="draft">
              <Event v-for="n in 3" :key="n" id="draft" />
            </v-tab-item>
          </v-tabs-items>
        </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import Event from '@/components/Events/Event';

export default {
  components: {
    Event
  },
  data: () => ({
    tabItems: ['published', 'draft'],
    tabsModel: 'published'
  })
};
</script>
