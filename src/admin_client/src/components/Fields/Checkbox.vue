<template>
  <div>
    <h3 class="font-weight-light">{{ label }}</h3>    
    <v-checkbox
      v-for="(item, index) in items"
      :value="item"
      :key="index"
      :label="item"
      v-model="val"
    />
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Checkbox'
    },
    value: {
      type: Array,
      default: function() {
        return [];
      }
    },
    items: {
      type: Array,
      default: function() {
        return ['item1'];
      }
    }
  },
  data: () => ({
    selected: []
  }),
  computed: {
    val: {
      get() {
        return this.value;
      },
      set(value) {
        this.selected = value;
      }
    }
  },
  watch: {
    selected() {
      this.$emit('changeCheckbox', this.selected);
    }
  }
};
</script>
