<template>
  <div>
    <div v-for="post in posts" :key="post.key">
      <SingleListPost :link-to="post.key">
        <template slot="title">{{ post.title }}</template>
        <template slot="datetime">{{ post.publishedAt | isoDateToDatetime }}</template>
        <template slot="action-menu-item"><PublishedActionMenuItem :post-id="post.key" :post-featured-image-path="post.featuredImage.fullPath" /></template>
      </SingleListPost>
    </div>
  </div>
</template>

<script>
import isoDateToDatetime from '@/helpers/isoDateToDatetime';
import SingleListPost from '@/components/Post/SingleListPost';

export default {
  props: {
    posts: {
      type: Array,
      default: () => ({})
    }
  },
  components: {
    SingleListPost,
    PublishedActionMenuItem: () =>
      import('@/components/Post/PublishedActionMenuItem')
  },
  filters: {
    isoDateToDatetime(isodate) {
      return isoDateToDatetime(isodate);
    }
  }
};
</script>
