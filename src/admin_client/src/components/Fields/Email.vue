<template>
  <v-text-field
    :label="label"
    box
    :value="value"
    @input="$emit('input', $event)"
    type="email"
  />
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Email'
    },
    value: {
      type: String,
      default: null
    }
  }
};
</script>
