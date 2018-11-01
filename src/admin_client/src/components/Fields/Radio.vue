<template>
  <div>
    <h3 class="font-weight-light">{{label}}</h3>
    <v-radio-group v-model="val">
      <v-radio
        v-for="(item, index) in items"
        :key="index"
        :label="item"
        :value="item"
        @change="$emit('change', $event)"
      />
    </v-radio-group>
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
      default: []
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
  }
};
</script>
