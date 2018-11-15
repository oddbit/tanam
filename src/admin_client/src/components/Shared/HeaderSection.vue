<template>
  <v-layout 
    row 
    justify-space-between 
    align-center
    class="mt-3 mb-2">
    <div class="wrapper">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
    </div>
    <slot name="actions" />
  </v-layout>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Section'
    },
    description: {
      type: String,
      default: 'Section description goes here'
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  h1 {
    font-weight: 600;
    font-size: 2rem;
    color: #444;
  }
  p {
    color: #555;
  }
}
</style>
