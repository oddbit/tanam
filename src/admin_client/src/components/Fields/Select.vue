<template>
  <div>
    <v-select
      v-model="selected"
      :items="itemsLocal"
      :label="label"
    />
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
  watch: {
    selected: function() {
      this.$emit('changeSelected', this.selected);
    }
  },
  mounted() {
    this.itemsLocal = this.items.split(',');
  },
};
</script>
