<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <div>
        <v-layout justify-center class="my-4">
          <v-flex xs12 md8>
            <v-btn class="ma-0" color="white">
              <v-icon left>create</v-icon>
              Create {{link}}
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
                <List
                  v-for="(post, index) in published"
                  v-if="post.status == 'published'"
                  :key="index"
                  :link="post.data.link"
                  :ContentTitle="post.data.ContentTitle"
                  :time="post.time"
                  :status="post.status"/>
              </v-tab-item>
              <v-tab-item id="unpublished">
                <List
                  v-for="(post, index) in published"
                  v-if="post.status == 'unpublished'"
                  :key="index"
                  :link="post.data.link"
                  :ContentTitle="post.data.ContentTitle"
                  :time="post.time"
                  :status="post.status"/>
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
import List from '@/components/ContentTypes/ContentTypesList';
import { CONTENTTYPE_POST } from '@/store/types'

export default {
  props: [
    'link'
  ],
  components: {
    List
  },
  computed: {
    published () {
      console.log(this.$store.getters[CONTENTTYPE_POST][this.link])
      return this.$store.getters[CONTENTTYPE_POST][this.link]
    }
  },
  mounted() {
    this.$store.dispatch(CONTENTTYPE_POST);
  },
  data: () => ({
    tabItems: ['published', 'unpublished'],
    tabsModel: 'published'
  })
}
</script>
