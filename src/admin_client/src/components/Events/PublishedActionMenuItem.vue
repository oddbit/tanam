<template>
  <div>
    <v-list-tile 
      v-for="item in listAction" 
      :key="item.name" 
      @click="handleClickActionItem(item.name)"
      ripple>
      <v-icon class="action-icon">{{ item.icon }}</v-icon>
      <v-list-tile-title>{{ item.text }}</v-list-tile-title>
    </v-list-tile>
  </div>
</template>

<script>
import { DELETE_POST } from '@/store/types';

export default {
  props: {
    postId: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    listAction: [
      { name: 'edit', text: 'Edit', icon: 'edit' },
      { name: 'delete', text: 'Delete', icon: 'delete' }
    ]
  }),
  methods: {
    handleClickActionItem(name) {
      switch (name) {
        case 'edit':
          this.$router.push('/events/post/' + this.postId);
          break;
        case 'delete':
          this.$store.dispatch(DELETE_POST, this.postId);
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.action-icon {
  margin-right: 8px;
}
</style>
