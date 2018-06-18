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
export default {
  data: () => ({
    listAction: [
      { name: 'edit', text: 'Edit', icon: 'edit' },
      { name: 'publish', text: 'Publish', icon: 'publish' },
      { name: 'delete', text: 'Delete', icon: 'delete' }
    ]
  }),
  methods: {
    handleClickActionItem() {
      return null;
    }
  }
};
</script>

<style lang="scss" scoped>
.action-icon {
  margin-right: 8px;
}
</style>
