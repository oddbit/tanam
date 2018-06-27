<template>
  <v-dialog v-model="dialogDelete" max-width="280">
    <v-card>
      <v-card-text>
        Are you sure?
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn flat @click="handleDialogCancel">Cancel</v-btn>
        <v-btn flat color="error" @click="handleDialogDelete">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { POST_DIALOG_DELETE, CUSTOM_DELETE_POST } from '@/store/types';

export default {
  computed: {
    dialogDelete: {
      get() {
        return this.$store.getters[POST_DIALOG_DELETE];
      },
      set(val) {
        this.$store.commit(POST_DIALOG_DELETE, { dialogDelete: val });
      }
    }
  },
  methods: {
    handleDialogCancel() {
      this.$store.commit(POST_DIALOG_DELETE, false);
    },
    handleDialogDelete() {
      this.$store
        .dispatch(CUSTOM_DELETE_POST)
        .then(() => this.$router.push('/events'));
    }
  }
};
</script>
