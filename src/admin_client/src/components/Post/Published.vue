<template>
  <div>
    <div v-for="post in posts" :key="post.key">
      <SingleListPost :link-to="post.key">
        <template slot="title">{{ post.data.title }}</template>
        <template slot="datetime">{{ post.updateTime | formatDate }}</template>
        <template slot="action-menu-item">
          <PublishedActionMenuItem :post-id="post.key" :post-featured-image-path="post.data.featuredImage" />
        </template>
      </SingleListPost>
    </div>
  </div>
</template>

<script>
import formatDate from '@/helpers/formatDate';
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
    formatDate(timestamp) {
      return formatDate(timestamp.toDate());
    }
  }
};
</script>
