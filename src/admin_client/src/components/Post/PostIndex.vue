<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <div>
        <v-layout justify-center class="my-4">
          <v-flex xs12 md8>
            <v-btn :to="{name: 'postNew', params: {link: `${ctKey}`}}" class="ma-0" color="white">
              <v-icon left>create</v-icon>
              Create {{ ctKey | toText }}
            </v-btn>
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
                <slot name="published" />
              </v-tab-item>
              <v-tab-item id="unpublished">
                <slot name="unpublished" />
              </v-tab-item>
            </v-tabs-items>
          </v-flex>
        </v-layout>
      </div>
    </v-slide-y-transition>
    <slot name="dialog-delete" />
  </v-container>
</template>

<script>
export default {
  props: {
    ctKey: {
      type: String,
      default: 'key'
    }
  },
  data: () => ({
    tabItems: ['published', 'unpublished'],
    tabsModel: 'published'
  }),
  filters: {
    toText(val) {
      return val.replace(/([a-zA-Z])(?=[A-Z])/g, '$1 ').toUpperCase();
    }
  }
};
</script>
