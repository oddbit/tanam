<template>
  <div>
    <div v-for="post in posts" :key="post.key">
      <SingleListPost :link-to="post.key">
        <template slot="title">{{ post.data.title }}</template>
        <template slot="datetime">{{ post.updateTime | formatDate }}</template>
        <template slot="action-menu-item"><DraftActionMenuItem /></template>
      </SingleListPost>
    </div>
  </div>
</template>

<script>
import SingleListPost from '@/components/Post/SingleListPost';
import formatDate from '@/helpers/formatDate';

export default {
  props: {
    posts: {
      type: Array,
      default: () => ({})
    }
  },
  components: {
    SingleListPost,
    DraftActionMenuItem: () => import('@/components/Post/DraftActionMenuItem')
  },
  filters: {
    formatDate(timestamp) {
      return formatDate(timestamp);
    }
  }
};
</script>
