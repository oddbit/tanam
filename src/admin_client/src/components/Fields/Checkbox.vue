<template>
  <div>
    <v-checkbox
      v-for="(item, index) in itemsLocal"
      :key="index"
      :label="item"
      v-model="valueCheckbox[item.toLowerCase()]"
      @change="change"
    ></v-checkbox>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Checkbox'
    },
    items: {
      type: String,
      default: null
    }
  },
  data: () => ({
    itemsLocal: [],
    valueCheckbox: {}
  }),
  mounted() {
    this.itemsLocal = this.items.split(',');
    this.itemsLocal.forEach(item => {
      this.valueCheckbox[item.toLowerCase()] = false;
    });
  },
  methods: {
    change: function() {
      this.$emit('changeCheckbox', this.valueCheckbox);
    }
  }
};
</script>
