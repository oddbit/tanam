<template>
  <div>
    <v-text-field
      v-model="password"
      :append-icon="show1 ? 'visibility_off' : 'visibility'"
      :rules="[rules.min]"
      :type="show1 ? 'text' : 'password'"
      name="input-10-1"
      label="Normal with hint text"
      hint="At least 8 characters"
      counter
      @click:append="show1 = !show1"
      @input="$emit('input', $event)"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      show1: false,
      password: '',
      rules: {
        min: v => v.length >= 8 || 'Min 8 characters'
      }
    };
  }
};
</script>
