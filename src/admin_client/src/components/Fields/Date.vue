<template>
  <div>
    <v-dialog
      :ref="`${name}Ref`"
      v-model="modal"
      :return-value.sync="modDate"
      lazy
      full-width
      width="290px"
    >
      <v-text-field
        slot="activator"
        v-model="modDate"
        :label="label"
        prepend-icon="event"
        readonly
      />
      <v-date-picker v-model="modDate">
        <v-spacer />
        <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
        <v-btn flat color="primary" @click="$refs[`${name}Ref`].save(modDate)">OK</v-btn>
      </v-date-picker>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Date'
    },
    name: {
      type: String,
      default: 'Date'
    },
    value: {
      type: String,
      default: null
    }
  },
  data: () => ({
    modal: false,
    date: ''
  }),
  computed: {
    modDate: {
      get() {
        return this.value || this.date;
      },
      set(val) {
        this.date = val;
      }
    }
  },
  watch: {
    date(val) {
      this.$emit('changeDate', val);
    }
  }
};
</script>
