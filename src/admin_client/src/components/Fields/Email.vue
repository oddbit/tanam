<template>
  <v-text-field
    :label="label"
    :value="value"
    type="email"
    @input="$emit('input', $event)"
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
