<template>
  <div>
    <v-text-field
      type="number"
      name="input-1"
      :label="label"
      id="test"
      min=0
      max=100
      step=0.1
      maxlength=3
      @input="$emit('input', $event)"
    ></v-text-field>
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