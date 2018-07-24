<template>
  <PostIndex>
    <template slot="button-create"><ButtonCreate :to="createEventLink" text="create event" icon="event" /></template>
    <template slot="published"><Published /></template>
    <template slot="draft"><Draft /></template>
    <template slot="dialog-delete"><DialogDelete /></template>
  </PostIndex>
</template>

<script>
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
    createEventLink: event.createEventLink
  })
};
</script>
