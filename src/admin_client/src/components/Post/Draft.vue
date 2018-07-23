<template>
  <div>
    <div v-for="post in posts" :key="post.key">
      <SingleListPost :link-to="post.key">
        <template slot="title">{{ post.title }}</template>
        <template slot="datetime">{{ post.createdAt | isoDateToDatetime }}</template>
        <template slot="action-menu-item"><DraftActionMenuItem /></template>
      </SingleListPost>
    </div>
  </div>
</template>

<script>
import SingleListPost from '@/components/Post/SingleListPost';
import isoDateToDatetime from '@/helpers/isoDateToDatetime';

export default {
  props: {
    posts: {
      type: Array,
      default: () => ({})
    }
  },
  components: {
    SingleListPost,
    DraftActionMenuItem: () => import('@/components/Events/DraftActionMenuItem')
  },
  filters: {
    isoDateToDatetime(isodate) {
      return isoDateToDatetime(isodate);
    }
  }
};
</script>
