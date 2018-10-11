<template>
  <v-textarea
    :label="label"
    :value="value"
    @input="$emit('input', $event)"
  />
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Textarea'
    },
    value: {
      type: String,
      default: null
    }
  }
};
</script>
