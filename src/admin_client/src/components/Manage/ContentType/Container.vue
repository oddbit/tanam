<template>
  <v-container>
    <DialogForm
      :edited-index="editedIndex"
      @close="close" 
      @save="save" 
      ref="createDialogRef" />
    <Table 
      :headers="headers" 
      :items="contentTypes" 
      @editContentType="editItem" 
      @deleteContentType="deleteItem" />
  </v-container>
</template>

<script>
import {
  MANAGE_CT_DIALOG,
  MANAGE_CT_EDITED_INDEX,
  MANAGE_CT_CONTENT_TYPES,
  MANAGE_CT_FIELDS_ITEM_DEFAULT,
  MANAGE_CT_EDITED_ITEM,
  MANAGE_CT_EDITED_ITEM_DEFAULT,
  MANAGE_CT_HEADERS_TABLE,
  MANAGE_CT_DIALOG_FORM,
  MANAGE_CT_SET_CONTENT_TYPE,
  MANAGE_CT_REMOVE_CONTENT_TYPE
} from '@/store/types';
import DialogForm from './DialogForm';
import Table from './Table';

export default {
  components: {
    DialogForm,
    Table
  },
  computed: {
    dialog: {
      get() {
        return this.$store.getters[MANAGE_CT_DIALOG];
      },
      set(val) {
        this.$store.commit(MANAGE_CT_DIALOG, val);
      }
    },
    editedIndex: {
      get() {
        return this.$store.getters[MANAGE_CT_EDITED_INDEX];
      },
      set(val) {
        this.$store.commit(MANAGE_CT_EDITED_INDEX, val);
      }
    },
    contentTypes() {
      return this.$store.getters[MANAGE_CT_CONTENT_TYPES];
    },
    headers() {
      return this.$store.getters[MANAGE_CT_HEADERS_TABLE];
    },
    editedItem: {
      get() {
        return this.$store.getters[MANAGE_CT_EDITED_ITEM];
      },
      set(val) {
        this.$store.commit(MANAGE_CT_EDITED_ITEM, val);
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
      const editedIndex = this.contentTypes.indexOf(item);
      this.editedIndex = editedIndex;
      const content = this.contentTypes[editedIndex];
      const fieldsItem = Object.keys(content.fields).map(key => ({
        ...content.fields[key]
      }));
      this.$store.commit(MANAGE_CT_DIALOG_FORM, {
        editedItem: { ...content.meta },
        fieldsItem: fieldsItem
      });
      this.dialog = true;
    },
    deleteItem(item) {
      confirm('Are you sure you want to delete this item?') &&
        this.$store.dispatch(MANAGE_CT_REMOVE_CONTENT_TYPE, item.meta.name);
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.$refs.createDialogRef.reset();
        this.$store.commit(MANAGE_CT_EDITED_ITEM_DEFAULT);
        this.$store.commit(MANAGE_CT_FIELDS_ITEM_DEFAULT);
        this.editedIndex = -1;
      }, 300);
    },
    async save() {
      if (this.$refs.createDialogRef.validate()) {
        try {
          await this.$store.dispatch(MANAGE_CT_SET_CONTENT_TYPE);
          this.close();
        } catch (error) {
          return;
        }
      }
    }
  }
};
</script>
