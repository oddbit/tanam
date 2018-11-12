<template>
  <v-dialog :value="dialog" max-width="290" @input="$emit('closeDialogItem')">
    <v-card>
      <v-card-title class="headline">Manage Item</v-card-title>
      <v-card-text>
        <v-combobox
          ref="itemField"
          v-model="item"
          deletable-chips
          append-icon=""
          hint="Enter to add item"
          label="Item"
          multiple
          chips
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="green darken-1" flat="flat" @click="$emit('closeDialogItem')">Close</v-btn>
        <v-btn color="green darken-1" flat="flat" @click="$emit('updateItem', newItem)">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    ObjItem: {
      type: Array,
      default: () => []
    },
    dialog: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    newItem: ''
  }),
  computed: {
    item: {
      get() {
        return this.ObjItem;
      },
      set(val) {
        this.newItem = val;
      }
    }
  },
  watch: {
    dialog() {
      this.$nextTick(() => {
        this.$refs.itemField.focus();
      });
    }
  }
};
</script>
