<template>
  <v-dialog v-model="dialog" max-width="650px">
    <v-btn 
      slot="activator" 
      color="primary" 
      dark 
      class="ma-0 mb-4">
      <v-icon left>create</v-icon>New Content Type
    </v-btn>
    <v-card>
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-lg>
          <v-form ref="contentTypeForm">
            <v-layout wrap="">
              <v-flex xs12 sm6 md4>
                <v-text-field
                  :rules="[v => !!v || 'Key is required', v => /^([a-zA-Z0-9])+$/.test(v) || 'Key cannot contain spaces']"
                  :disabled="readOnly(editedItem)"
                  v-model="editedItem.key"
                  label="Key"
                  placeholder="Ex. event"
                  hint="Can't edit later"
                  persistent-hint
                />
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field
                  v-model="editedItem.name"
                  :rules="[v => !!v || 'Name is required']"
                  label="Name"
                  placeholder="Ex. Event"
                  hint="Displayed in drawer menu"
                  persistent-hint
                />
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field
                  v-model="editedItem.icon"
                  label="Icon"
                  placeholder="Ex. event"
                  hint="See icon list in <a href='https://material.io/tools/icons' target='_blank'>material icons</a>"
                  persistent-hint
                />
              </v-flex>
            </v-layout>
            <v-layout class="mt-3">
              <v-flex>
                <h4 class="add-fields">
                  <span>Add Fields</span>
                  <v-btn 
                    flat 
                    icon 
                    color="primary" 
                    @click="addMoreField">
                    <v-icon>add_circle</v-icon>
                  </v-btn>
                </h4>
              </v-flex>
            </v-layout>
            <v-layout v-for="(field, index) in fieldsItem" :key="`field-${index}`">
              <v-flex lg11>
                <v-layout>
                  <v-flex lg4>
                    <v-select
                      :items="fieldTypeItems"
                      :rules="[v => !!v || 'Field type is required']"
                      v-model="fieldsItem[index].type"
                      :disabled="configureField(field, 'type').readOnly"
                      label="Select Field Type"
                    />
                  </v-flex>
                  <v-flex lg4>
                    <v-text-field
                      v-model="fieldsItem[index].key"
                      :rules="[v => !!v || 'Field key is required', v => /^([a-zA-Z0-9])+$/.test(v) || 'Field key cannot contain spaces']"
                      :disabled="configureField(field).readOnly"
                      :hint="configureField(field).fieldKeyHint"
                      label="Field Key"
                      persistent-hint
                    />
                  </v-flex>
                  <v-flex lg4>
                    <v-text-field
                      v-model="fieldsItem[index].name"
                      :rules="[v => !!v || 'Field name is required']"
                      label="Field Name"
                    />
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex 
                lg1 
                d-flex 
                align-center 
                class="pa-0">
                <v-tooltip top>
                  <v-btn
                    v-if="fieldsItem[index].type == 'select' || fieldsItem[index].type == 'radio' || fieldsItem[index].type == 'checkbox'"
                    slot="activator"
                    class="primary white--text"
                    fab
                    flat
                    small
                    @click="manageItem(fieldsItem[index], index)"
                  >
                    <v-icon>format_list_bulleted</v-icon>
                  </v-btn>
                  <span>Manage Item</span>
                </v-tooltip>
              </v-flex>
              <v-flex 
                lg1 
                d-flex 
                align-center 
                class="pa-0">
                <v-tooltip top>
                  <v-btn
                    v-if="!configureField(field).disableRemove"
                    slot="activator"
                    flat
                    icon
                    small
                    color="error"
                    @click="removeField(index)"
                  >
                    <v-icon>remove_circle</v-icon>
                  </v-btn>
                  <span>Delete</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="blue darken-1" flat @click.native="$emit('close')">Cancel</v-btn>
        <v-btn color="blue darken-1" flat @click.native="$emit('save')">Save</v-btn>
      </v-card-actions>
    </v-card>

    <dialog-item 
      :obj-item="tmpItem.item" 
      :dialog="dialogManageItem" 
      @closeDialogItem="closeDialogItem" 
      @updateItem="updateItem($event)" />

</v-dialog></template>

<script>
import DialogItem from '@/components/Manage/ContentType/DialogItem';

import {
  CONTENT_TYPE_DIALOG,
  CONTENT_TYPE_EDITED_ITEM,
  CONTENT_TYPE_ADD_FIELD,
  CONTENT_TYPE_FIELDS_ITEM,
  CONTENT_TYPE_FIELD_TYPE_ITEMS,
  CONTENT_TYPE_REMOVE_FIELD
} from '@/store/types';

export default {
  components: {
    DialogItem
  },
  props: {
    editedIndex: {
      type: Number,
      default: -1
    }
  },
  data: () => ({
    dialogManageItem: false,
    tmpItem: {
      item: []
    }
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Content Type' : 'Edit Content Type';
    },
    dialog: {
      get() {
        return this.$store.getters[CONTENT_TYPE_DIALOG];
      },
      set(val) {
        this.$store.commit(CONTENT_TYPE_DIALOG, val);
      }
    },
    editedItem: {
      get() {
        return this.$store.getters[CONTENT_TYPE_EDITED_ITEM];
      },
      set(val) {
        this.$store.commit(CONTENT_TYPE_EDITED_ITEM, val);
      }
    },
    fieldsItem() {
      return this.$store.getters[CONTENT_TYPE_FIELDS_ITEM];
    },
    fieldTypeItems() {
      return this.$store.getters[CONTENT_TYPE_FIELD_TYPE_ITEMS];
    }
  },
  methods: {
    closeDialogItem() {
      this.dialogManageItem = false;
      this.tmpItem = { item: [] };
    },
    updateItem(content) {
      this.fieldsItem[this.tmpItem.index].item = content;
      this.dialogManageItem = false;
      this.tmpItem = { item: [] };
    },
    manageItem(item, index) {
      this.tmpItem = {
        ...item,
        index: index
      };
      this.dialogManageItem = true;
    },
    addMoreField() {
      this.$store.commit(CONTENT_TYPE_ADD_FIELD);
    },
    removeField(index) {
      this.$store.commit(CONTENT_TYPE_REMOVE_FIELD, index);
    },
    reset() {
      this.$refs.contentTypeForm.reset();
    },
    validate() {
      return this.$refs.contentTypeForm.validate();
    },
    readOnly(field, type) {
      if (field && !field.pk && type === 'type') {
        return false;
      } else if ((field && field.pk) || (field && field._v)) {
        return true;
      } else {
        return false;
      }
    },
    configureField(field, type = null) {
      return {
        disableRemove: field.pk || false,
        readOnly: this.readOnly(field, type),
        fieldKeyHint: field.pk
          ? 'Unique identifier field'
          : "Can't edited later"
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.add-fields {
  display: flex;
  align-items: center;
}
</style>
