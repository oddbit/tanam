<template>
  <PostIndex>
    <template slot="button-create"><ButtonCreate :to="createLink" text="create event" icon="event" /></template>
    <template slot="published"><Published /></template>
    <template slot="draft"><Draft /></template>
    <template slot="dialog-delete"><DialogDelete /></template>
  </PostIndex>
</template>

<script>
import { POST_CONTENT_TYPE } from '@/store/types';
import { event } from '@/config/post';
import PostIndex from '@/components/Post/PostIndex';
import ButtonCreate from '@/components/Post/ButtonCreate';

export default {
  components: {
    PostIndex,
    ButtonCreate,
    Published: () => import('@/components/Event/Published'),
    Draft: () => import('@/components/Event/Draft'),
    DialogDelete: () => import('@/components/Post/DialogDelete')
  },
  data: () => ({
    createLink: event.createLink
  }),
  created() {
    this.$store.commit(POST_CONTENT_TYPE, event.contentType);
  }
};
</script>
