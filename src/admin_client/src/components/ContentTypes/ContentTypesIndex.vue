<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <div>
        <v-layout justify-center class="my-4">
          <v-flex xs12 md8>
            <v-btn class="ma-0" color="white" :to="{name: 'contentTypeNew', params: {link: `${link}`}}">
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
                  :key="index"
                  :link="post.data.link"
                  :ContentTitle="post.data.title"
                  :time="post.updateTime"
                  :status="post.status"/>
              </v-tab-item>
              <v-tab-item id="unpublished">
                <List
                  v-for="(post, index) in unpublished"
                  :key="index"
                  :link="post.data.link"
                  :ContentTitle="post.data.title"
                  :time="post.updateTime"
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
import { CONTENTTYPE_POST, CONTENTTYPE_DRAFT } from '@/store/types'

export default {
  props: [
    'link'
  ],
  components: {
    List
  },
  computed: {
    published () {
      console.log(this.$store.getters[CONTENTTYPE_POST])
      return this.$store.getters[CONTENTTYPE_POST]
    },
    unpublished () {
      console.log(this.$store.getters[CONTENTTYPE_DRAFT])
      return this.$store.getters[CONTENTTYPE_DRAFT]
    }
  },
  mounted() {
    this.$store.dispatch(CONTENTTYPE_POST, this.link);
    this.$store.dispatch(CONTENTTYPE_DRAFT, this.link);
  },
  data: () => ({
    tabItems: ['published', 'unpublished'],
    tabsModel: 'published'
  })
}
</script>
