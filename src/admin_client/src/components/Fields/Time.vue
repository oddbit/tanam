<template>
  <div>
    <v-dialog
      :ref="`${name}Ref`"      
      v-model="modal"
      :return-value.sync="modTime"
      persistent
      lazy
      full-width
      width="290px"
    >
      <v-text-field
        slot="activator"
        v-model="modTime"
        :label="label"        
        prepend-icon="access_time"
        readonly
      />
      <v-time-picker
        v-if="modal"
        v-model="modTime"
        format="24hr"
        full-width
      >
        <v-spacer />
        <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
        <v-btn flat color="primary" @click="$refs[`${name}Ref`].save(modTime)">OK</v-btn>
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
    },
    value: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      modal: false,
      time: ''
    };
  },
  computed: {
    modTime: {
      get() {
        return this.value || this.time;
      },
      set(val) {
        this.time = val;
      }
    }
  },
  watch: {
    time(val) {
      this.$emit('changeTime', val);
    }
  }
};
</script>
