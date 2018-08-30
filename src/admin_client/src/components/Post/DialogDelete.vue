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
import {
  POST_DIALOG_DELETE,
  POST_ID,
  POST_ACTION_DELETE,
  POST_CONTENT_TYPE
} from '@/store/types';
import { blog, event } from '@/config/post';

export default {
  computed: {
    contentType() {
      return this.$store.getters[POST_CONTENT_TYPE];
    },
    dialogDelete: {
      get() {
        return this.$store.getters[POST_DIALOG_DELETE];
      },
      set(val) {
        this.$store.commit(POST_DIALOG_DELETE, val);
      }
    },
    routerPush() {
      return this.contentType === 'event' ? event.indexLink : blog.indexLink;
    }
  },
  methods: {
    handleDialogCancel() {
      this.$store.commit(POST_DIALOG_DELETE, false);
    },
    async handleDialogDelete() {
      try {
        await this.$store.dispatch(
          POST_ACTION_DELETE,
          this.$store.getters[POST_ID]
        );
        this.$store.commit(POST_DIALOG_DELETE, false);
        this.$store.commit(POST_ID, null);
        this.$router.push(this.routerPush);
      } catch (error) {
        this.$store.commit(POST_DIALOG_DELETE, false);
        this.$store.commit(POST_ID, null);
        alert('Failed to delete');
      }
    }
  }
};
</script>
