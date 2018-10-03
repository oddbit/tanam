<template>
  <div>
    <v-dialog
      :ref="`${name}Ref`"      
      v-model="modal"
      :return-value.sync="time"
      persistent
      lazy
      full-width
      width="290px"
    >
      <v-text-field
        box
        slot="activator"
        v-model="time"
        :label="label"        
        prepend-icon="access_time"
        readonly
      />
      <v-time-picker
        format="24hr"
        v-if="modal"
        v-model="time"
        full-width
      >
        <v-spacer />
        <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
        <v-btn flat color="primary" @click="$refs[`${name}Ref`].save(time)">OK</v-btn>
      </v-time-picker>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Time'
    },
    name: {
      type: String,
      default: 'Time'
    }
  },
  data() {
    return {
      time: null,
      modal: false
    };
  },
  watch: {
    time: function() {
      this.$emit('changeTime', this.time);
    }
  }
};
</script>
