<template>
  <div class="border">
    <h2>{{label}}</h2>
    <v-text-field
      v-for="(item, index) in value"
      :key="index"
      label="item"
      prepend-icon="fiber_manual_record"
      v-model="value[index]"
      solo
    ></v-text-field>
    <v-text-field
      label="Add item"
      v-model="another"></v-text-field>
    <v-btn @click="addItem">Add Item</v-btn>
  </div>
</template>

<style scoped>
  .border {
    border: 1px solid #c6c6c6;
    padding: 10px;
  }
</style>


<script>
export default {
  props: {
    label: {
      type: String,
      default: 'List'
    },
    value: {
      type: Array,
      default: () => []
    },
  },
  data: () => ({
    another: ''
  }),
  methods: {
    addItem () {
      this.value.push(this.another)
      this.another = ''
    }
  },
  watch: {
    value: function() {
      this.$emit('changeList', this.value);
    }
  },
};
</script>
