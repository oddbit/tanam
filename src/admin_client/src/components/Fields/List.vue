<template>
  <div>
    <h3 class="font-weight-light">{{ label }}</h3>
    <div class="border">
      <v-text-field
        v-for="(item, index) in value"
        :key="index"
        :label="`Item ${index + 1}`"
        v-model="value[index]"
        prepend-icon="close"
        @click:prepend="deleteItemList(item)"
      />
      <v-text-field
        v-model="another"
        :error-messages="errMsg"
        label="Add item"
        hint="Enter to add item"
        @keyup.enter="addItem" />
    </div>
  </div>
</template>

<style scoped>
.border {
  border: 3px solid #c6c6c6;
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
    }
  },
  data: () => ({
    another: '',
    errMsg: ''
  }),
  watch: {
    another() {
      this.errMsg = '';
    },
    value() {
      this.$emit('changeList', this.value);
    }
  },
  methods: {
    deleteItemList(item) {
      this.value = this.value.filter(el => {
        return el != item;
      });
    },
    addItem() {
      if (this.value.includes(this.another)) {
        return (this.errMsg = 'Item already exist');
      }
      this.value.push(this.another);
      this.another = '';
    }
  }
};
</script>
