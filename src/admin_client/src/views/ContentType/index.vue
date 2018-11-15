<template>
  <v-container>
    <post-index :ct-key="ctKey" />
    <post-list :ct-key="ctKey" />
  </v-container>
</template>

<script>
import PostIndex from '@/components/Post/PostIndex';
import PostList from '@/components/Post/PostList';

export default {
  components: {
    PostIndex,
    PostList
  },
  props: {
    ctKey: {
      type: String,
      default: 'name'
    }
  }
};
</script>
