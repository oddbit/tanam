<template>
  <v-dialog
    v-model="dialog"
    max-width="290">
    <slot slot="activator" name="openBtn" />
    <v-card>
      <v-card-title class="title">
        Warning!
      </v-card-title>
      <v-card-text>
        This process will delete post permanently<br>
        Delete "{{ title }}" ?
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          :disabled="isSubmitting"
          color="grey"
          outline
          @click="dialog = false">
          Cancel
        </v-btn>
        <v-btn
          :loading="isSubmitting"
          color="red darken-1"
          dark
          @click="deletePage">
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { PAGE_DELETE } from '@/store/types';

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    dialog: false,
    isSubmitting: false
  }),
  methods: {
    async deletePage() {
      this.isSubmitting = true;
      try {
        await this.$store.dispatch(PAGE_DELETE, this.id);
        this.dialog = false;
        this.isSubmitting = false;
      } catch (error) {
        this.isSubmitting = false;
      }
    }
  }
};
</script>
