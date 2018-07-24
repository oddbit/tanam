<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <div>
        <v-layout justify-center class="my-4">
          <v-flex xs12 md8>
            <v-btn class="ma-0" color="white" to="/blog/post">Create Blog Post <v-icon right>library_books</v-icon></v-btn>
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
                <PublishedBlogs 
                  v-for="blog in publishedBlogs" 
                  :key="blog.key"
                  :published-blog="blog" />
              </v-tab-item>
              <v-tab-item id="draft" />
            </v-tabs-items>
          </v-flex>
        </v-layout>
      </div>
    </v-slide-y-transition>
    <DialogDelete />
  </v-container>
</template>

<script>
import {
  GET_PUBLISHED_BLOGS,
  PUBLISHED_BLOGS,
  BLOG_POST_ID
} from '@/store/types';
import DialogDelete from '@/components/Blog/DialogDelete';

export default {
  components: {
    PublishedBlogs: () => import('@/components/Blog/PublishedBlogs'),
    DialogDelete
  },
  data: () => ({
    tabItems: ['published', 'draft'],
    tabsModel: 'published'
  }),
  computed: {
    publishedBlogs() {
      return this.$store.getters[PUBLISHED_BLOGS];
    }
  },
  mounted() {
    this.$store.commit(BLOG_POST_ID, null);
    this.$store.dispatch(GET_PUBLISHED_BLOGS);
  }
};
</script>
