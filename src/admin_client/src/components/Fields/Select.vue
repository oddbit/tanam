<template>
  <div>
    <v-select
      v-model="val"
      :items="items"
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
      type: Array,
      default: function () { return ['item1'] }
    }
  },
  data: () => ({
    selected: ''
  }),
  computed: {
    val: {
      get () {
        return this.value
      },
      set (val) {
        this.selected = val
      }
    }
  },
  watch: {
    selected () {
      this.$emit('changeSelected', this.selected);
    }
  }
};
</script>
