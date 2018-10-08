<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-btn 
      slot="activator" 
      color="primary" 
      dark 
      class="ma-0 mb-4"><v-icon left>create</v-icon>New Content Type</v-btn>
    <v-card>
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>

      <v-card-text>
        <v-container grid-list-lg>
          <v-form ref="contentTypeForm">
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field 
                  v-model="editedItem.name" 
                  label="Name" 
                  :rules="[v => !!v || 'Name is required', v => /^([a-zA-Z0-9])+$/.test(v) || 'Name cannot contain spaces']"
                  placeholder="Ex. event" 
                  hint="Can't edit later" 
                  :readonly="readOnly()"
                  persistent-hint />
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field 
                  v-model="editedItem.title" 
                  :rules="[v => !!v || 'Title is required']"
                  label="Title" 
                  placeholder="Ex. Event" 
                  hint="Displayed in drawer menu"
                  persistent-hint />
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field 
                  v-model="editedItem.icon" 
                  label="Icon" 
                  placeholder="Ex. event" 
                  hint="See icon list in <a href='https://material.io/tools/icons' target='_blank'>material icons</a>" 
                  persistent-hint />
              </v-flex>
            </v-layout>
            <v-layout class="mt-3">
              <v-flex>
                <h4 class="add-fields">
                  <span>Add Fields</span>
                  <v-btn 
                    flat 
                    icon 
                    @click="addMoreField" 
                    color="primary"><v-icon>add_circle</v-icon></v-btn>
                </h4>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex lg11>
                <v-layout>
                  <v-flex lg4>
                    <v-select
                      :items="fieldTypeItems"
                      :rules="[v => !!v || 'Field type is required']"
                      label="Select Field Type"
                      value="text"
                    />
                  </v-flex>
                  <v-flex lg4>
                    <v-text-field 
                      value="title"
                      :rules="[v => !!v || 'Field name is required', v => /^([a-zA-Z0-9])+$/.test(v) || 'Field name cannot contain spaces']"
                      label="Field Name" 
                      :readonly="readOnly(index)"
                      hint="Can't edit later" 
                      persistent-hint />
                  </v-flex>
                  <v-flex lg4>
                    <v-text-field 
                      value="Title" 
                      :rules="[v => !!v || 'Field title is required']" 
                      label="Field Title" />
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
            <v-layout v-for="(field, index) in fieldsItem" :key="`field-${index}`">
              <v-flex lg11>
                <v-layout>
                  <v-flex lg4>
                    <v-select
                      :items="fieldTypeItems"
                      :rules="[v => !!v || 'Field type is required']"
                      label="Select Field Type"
                      v-model="fieldsItem[index].type"
                    />
                  </v-flex>
                  <v-flex lg4>
                    <v-text-field 
                      v-model="fieldsItem[index].name"
                      :rules="[v => !!v || 'Field name is required', v => /^([a-zA-Z0-9])+$/.test(v) || 'Field name cannot contain spaces']"
                      label="Field Name" 
                      :readonly="readOnly(index)"
                      hint="Can't edit later" 
                      persistent-hint />
                  </v-flex>
                  <v-flex lg4>
                    <v-text-field v-model="fieldsItem[index].title" :rules="[v => !!v || 'Field title is required']" label="Field Title" />
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex 
                lg1 
                d-flex 
                align-center
                class="pa-0">
                <v-btn 
                  flat 
                  icon 
                  small 
                  @click="removeField(index)" 
                  color="error"><v-icon>remove_circle</v-icon></v-btn>
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
  </v-dialog>
</template>

<script>
import {
  MANAGE_CT_DIALOG,
  MANAGE_CT_EDITED_ITEM,
  MANAGE_CT_ADD_FIELD,
  MANAGE_CT_FIELDS_ITEM,
  MANAGE_CT_FIELD_TYPE_ITEMS,
  MANAGE_CT_REMOVE_FIELD
} from '@/store/types';

export default {
  props: {
    editedIndex: {
      type: Number,
      default: -1
    }
  },
  data: () => ({
    totalFields: 1
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Content Type' : 'Edit Content Type';
    },
    dialog: {
      get() {
        return this.$store.getters[MANAGE_CT_DIALOG];
      },
      set(val) {
        this.$store.commit(MANAGE_CT_DIALOG, val);
      }
    },
    editedItem: {
      get() {
        return this.$store.getters[MANAGE_CT_EDITED_ITEM];
      },
      set(val) {
        this.$store.commit(MANAGE_CT_EDITED_ITEM, val);
      }
    },
    fieldsItem() {
      return this.$store.getters[MANAGE_CT_FIELDS_ITEM];
    },
    fieldTypeItems() {
      return this.$store.getters[MANAGE_CT_FIELD_TYPE_ITEMS];
    }
  },
  methods: {
    addMoreField() {
      this.$store.commit(MANAGE_CT_ADD_FIELD);
    },
    removeField(index) {
      this.$store.commit(MANAGE_CT_REMOVE_FIELD, index);
    },
    reset() {
      this.$refs.contentTypeForm.reset();
    },
    validate() {
      return this.$refs.contentTypeForm.validate();
    },
    readOnly(index) {
      if (this.editedIndex === -1) {
        return false;
      } else {
        if (index && index + 1 > this.totalFields) {
          return false;
        }
        return true;
      }
    }
  },
  watch: {
    dialog(val) {
      if (val) {
        this.totalFields = this.fieldsItem.length;
      }
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
