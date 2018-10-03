<template>
  <div>
    <v-dialog
      :ref="`${name}Ref`"
      v-model="modal"
      :return-value.sync="date"
      lazy
      full-width
      width="290px"
    >
      <v-text-field
        slot="activator"
        v-model="date"
        :label="label"
        prepend-icon="event"
        box
        readonly
      />
      <v-date-picker v-model="date">
        <v-spacer />
        <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
        <v-btn flat color="primary" @click="$refs[`${name}Ref`].save(date)">OK</v-btn>
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
    }
  },
  data: () => ({
    date: null,
    modal: false
  }),
  watch: {
    date: function() {
      this.$emit('changeDate', this.date);
    }
  }
};
</script>
