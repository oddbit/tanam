<template>
  <PostIndex>
    <template slot="button-create"><ButtonCreate :to="createLink" text="create blog" icon="library_books" /></template>
    <template slot="published"><Published /></template>
    <template slot="draft"><Draft /></template>
    <template slot="dialog-delete"><DialogDelete /></template>
  </PostIndex>
</template>

<script>
import { POST_CONTENT_TYPE } from '@/store/types';
import { blog } from '@/config/post';
import PostIndex from '@/components/Post/PostIndex';
import ButtonCreate from '@/components/Post/ButtonCreate';

export default {
  components: {
    PostIndex,
    ButtonCreate,
    Published: () => import('@/components/Blog/Published'),
    Draft: () => import('@/components/Blog/Draft'),
    DialogDelete: () => import('@/components/Post/DialogDelete')
  },
  data: () => ({
    createLink: blog.createLink
  }),
  created() {
    this.$store.commit(POST_CONTENT_TYPE, blog.contentType);
  }
};
</script>
