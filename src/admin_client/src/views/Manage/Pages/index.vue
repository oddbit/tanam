<template>
  <PostIndex>
    <template slot="published" />
    <template slot="draft" />
  </PostIndex>
</template>

<script>
import PostIndex from '@/components/Post/PostIndex';
import PostList from '@/components/Post/PostList';

export default {
  components: {
    PostIndex,
    PostList
  },
  data: () => ({
    createLink: '/templates/pages/post'
  })
};
</script>
