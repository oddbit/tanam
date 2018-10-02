<template>
  <div>
    <v-dialog
      :ref="`${name}DateRef`"
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
        readonly
      />
      <v-date-picker v-model="date">
        <v-spacer />
        <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
        <v-btn flat color="primary" @click="$refs[`${name}Ref`].save(date)">OK</v-btn>
      </v-date-picker>
    </v-dialog>
    <v-dialog
      :ref="`${name}TimeRef`"
      v-model="modal2"
      :return-value.sync="time"
      persistent
      lazy
      full-width
      width="290px"
    >
      <v-text-field
        slot="activator"
        v-model="time"
        label="Picker in dialog"
        prepend-icon="access_time"
        readonly
      />
      <v-time-picker
        v-if="modal2"
        v-model="time"
        full-width
      >
        <v-spacer/>
        <v-btn flat color="primary" @click="modal2 = false">Cancel</v-btn>
        <v-btn flat color="primary" @click="$refs.dialog.save(time)">OK</v-btn>
      </v-time-picker>
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
  })
};
</script>
