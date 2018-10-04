<template>
  <v-radio-group>
    <v-radio
      v-for="(item, index) in itemsLocal"
      :key="index"
      :label="item"
      :value="item"
      @change="$emit('change', $event)"
    ></v-radio>
  </v-radio-group>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Select'
    },
    value: {
      type: String,
      default: null
    },
    items: {
      type: String,
      default: 'item1,item2'
    }
  },
  data: () => ({
    itemsLocal: []
  }),
  mounted() {
    this.itemsLocal = this.items.split(',');
  }
};
</script>
