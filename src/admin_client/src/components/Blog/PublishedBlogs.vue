<template>
  <Blog :link-to="publishedBlog.key">
    <template slot="title">{{ publishedBlog.title }}</template>
    <template slot="datetime">{{ publishedBlog.publishedAt | isoDateToDatetime }}</template>
    <template slot="action-menu-item"><PublishedActionMenuItem :post-id="publishedBlog.key" /></template>
  </Blog>
</template>

<script>
import Blog from '@/components/Blog/Blog';
import isoDateToDatetime from '@/helpers/isoDateToDatetime';

export default {
  props: {
    publishedBlog: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    Blog,
    PublishedActionMenuItem: () =>
      import('@/components/Blog/PublishedActionMenuItem')
  },
  filters: {
    isoDateToDatetime(isodate) {
      return isoDateToDatetime(isodate);
    }
  }
};
</script>
