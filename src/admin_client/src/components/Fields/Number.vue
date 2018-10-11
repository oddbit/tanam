<template>
  <div>
    <v-text-field
      id="test"
      :label="label"
      type="number"
      name="input-1"
      min="0"
      max="100"
      step="0.1"
      maxlength="3"
      @input="$emit('input', $event)"
    />
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Text'
    },
    value: {
      type: String,
      default: null
    }
  }
};
</script>
