<template>
  <div>
    <v-select
      v-model="selected"
      :items="itemsLocal"
      box
      :label="label"
    ></v-select>
  </div>
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
    itemsLocal: [],
    selected: null
  }),
  mounted() {
    this.itemsLocal = this.items.split(',');
  },
  watch: {
    selected: function() {
      this.$emit('changeSelected', this.selected);
    }
  }
};
</script>