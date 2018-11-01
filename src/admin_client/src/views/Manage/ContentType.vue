<template>
  <v-container>
    <DialogForm
      ref="createDialogRef" 
      :edited-index="editedIndex"
      @close="close" 
      @save="save" />
    <Table 
      :headers="headers" 
      :items="contentType" 
      @editContentType="editItem" 
      @deleteContentType="deleteItem" />
  </v-container>
</template>

<script>
import {
  CONTENT_TYPE_DIALOG,
  CONTENT_TYPE_EDITED_INDEX,
  CONTENT_TYPE_GET_ARRAY,
  CONTENT_TYPE_FIELDS_ITEM_DEFAULT,
  CONTENT_TYPE_EDITED_ITEM,
  CONTENT_TYPE_EDITED_ITEM_DEFAULT,
  CONTENT_TYPE_HEADERS_TABLE,
  CONTENT_TYPE_DIALOG_FORM,
  CONTENT_TYPE_SET_CONTENT_TYPE,
  CONTENT_TYPE_REMOVE_CONTENT_TYPE
} from '@/store/types';
import DialogForm from '@/components/Manage/ContentType/DialogForm';
import Table from '@/components/Manage/ContentType/Table';
import { setTimeout } from 'timers';

export default {
  components: {
    DialogForm,
    Table
  },
  computed: {
    dialog: {
      get() {
        return this.$store.getters[CONTENT_TYPE_DIALOG];
      },
      set(val) {
        this.$store.commit(CONTENT_TYPE_DIALOG, val);
      }
    },
    editedIndex: {
      get() {
        return this.$store.getters[CONTENT_TYPE_EDITED_INDEX];
      },
      set(val) {
        this.$store.commit(CONTENT_TYPE_EDITED_INDEX, val);
      }
    },
    contentType() {
      return this.$store.getters[CONTENT_TYPE_GET_ARRAY];
    },
    headers() {
      return this.$store.getters[CONTENT_TYPE_HEADERS_TABLE];
    },
    editedItem: {
      get() {
        return this.$store.getters[CONTENT_TYPE_EDITED_ITEM];
      },
      set(val) {
        this.$store.commit(CONTENT_TYPE_EDITED_ITEM, val);
      }
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  methods: {
    editItem(item) {
      const editedIndex = this.contentType.indexOf(item);
      this.editedIndex = editedIndex;
      const content = this.contentType[editedIndex];
      const fieldsItem = Object.keys(content.fields).map(key => ({
        ...content.fields[key]
      }));
      this.$store.commit(CONTENT_TYPE_DIALOG_FORM, {
        editedItem: { ...content.meta },
        fieldsItem: fieldsItem
      });
      this.dialog = true;
    },
    deleteItem(item) {
      confirm('Are you sure you want to delete this item?') &&
        this.$store.dispatch(CONTENT_TYPE_REMOVE_CONTENT_TYPE, item.meta.key);
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.$refs.createDialogRef.reset();
        this.editedIndex = -1;
        setTimeout(() => {
          this.$store.commit(CONTENT_TYPE_EDITED_ITEM_DEFAULT);
          this.$store.commit(CONTENT_TYPE_FIELDS_ITEM_DEFAULT);
        }, 0);
      }, 300);
    },
    async save() {
      if (this.$refs.createDialogRef.validate()) {
        try {
          await this.$store.dispatch(CONTENT_TYPE_SET_CONTENT_TYPE);
          this.close();
        } catch (error) {
          return;
        }
      }
    }
  }
};
</script>
