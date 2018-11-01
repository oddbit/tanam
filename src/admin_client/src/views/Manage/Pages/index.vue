<template>
  <PostIndex>
    <template slot="published" />
    <template slot="draft" />
    <template slot="dialog-delete" />
  </PostIndex>
</template>

<script>
import { POST_CONTENT_TYPE } from '@/store/types';
import PostIndex from '@/components/Post/PostIndex';
import PostList from '@/components/Post/PostList';

export default {
  components: {
    PostIndex,
    PostList,
    DialogDelete: () => import('@/components/Post/DialogDelete')
  },
  data: () => ({
    createLink: '/templates/pages/post'
  }),
  created() {
    this.$store.commit(POST_CONTENT_TYPE, 'pages');
  }
};
</script>
