<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <div>
        <v-layout justify-center class="my-4">
          <v-flex xs12 md8>
            <slot name="button-create" />
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
              <v-tab-item id="draft">
                <slot name="draft" />
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
  data: () => ({
    tabItems: ['published', 'unpublished'],
    tabsModel: 'published'
  })
};
</script>
