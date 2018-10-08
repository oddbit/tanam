import {
  MANAGE_CT_DIALOG,
  MANAGE_CT_EDITED_INDEX,
  MANAGE_CT_CONTENT_TYPES,
  MANAGE_CT_EDITED_ITEM,
  MANAGE_CT_ADD_FIELD,
  MANAGE_CT_FIELDS_ITEM,
  MANAGE_CT_FIELD_TYPE_ITEMS,
  MANAGE_CT_REMOVE_FIELD,
  MANAGE_CT_EDITED_ITEM_DEFAULT,
  MANAGE_CT_HEADERS_TABLE,
  MANAGE_CT_FIELDS_ITEM_DEFAULT,
  MANAGE_CT_DIALOG_FORM,
  MANAGE_CT_SET_CONTENT_TYPE,
  MANAGE_CT_REMOVE_CONTENT_TYPE
} from '@/store/types';

import * as getters from './getters';
import * as mutations from './mutations';
import * as actions from './actions';

const state = {
  dialog: false,
  editedIndex: -1,
  editedItem: {
    key: '',
    name: '',
    icon: ''
  },
  defaultItem: {
    key: '',
    name: '',
    icon: ''
  },
  headers: [
    { text: 'Key', sortable: false, value: 'key', align: 'center' },
    { text: 'Name', value: 'name', sortable: false, align: 'center' },
    { text: 'Icon', value: 'icon', sortable: false, align: 'center' },
    { text: 'Fields', value: 'fields', sortable: false, align: 'center' },
    { text: 'Actions', value: 'key', sortable: false, align: 'center' }
  ],
  fieldsItem: [
    { key: 'title', name: 'Title', type: 'text', pk: true },
    { key: '', name: '', type: '' }
  ],
  fieldTypeItems: [
    { text: 'Text', value: 'text' },
    { text: 'Textarea', value: 'textarea' },
    { text: 'Number', value: 'number' },
    { text: 'List', value: 'list' },
    { text: 'Select', value: 'select' },
    { text: 'Radio', value: 'radio' },
    { text: 'Checkbox', value: 'checkbox' },
    { text: 'Date', value: 'date' },
    { text: 'Time', value: 'time' },
    { text: 'Datetime', value: 'datetime' },
    { text: 'Email', value: 'email' },
    { text: 'Password', value: 'password' },
    { text: 'Image', value: 'image' },
    { text: 'WYSIWYG', value: 'wysiwyg' }
  ],
  contentTypes: []
};

export default {
  state,
  getters: {
    [MANAGE_CT_DIALOG]: getters.getDialog,
    [MANAGE_CT_EDITED_INDEX]: getters.getEditedIndex,
    [MANAGE_CT_CONTENT_TYPES]: getters.getContentTypes,
    [MANAGE_CT_EDITED_ITEM]: getters.getEditedItem,
    [MANAGE_CT_FIELDS_ITEM]: getters.getFieldsItem,
    [MANAGE_CT_FIELD_TYPE_ITEMS]: getters.getFieldTypeItems,
    [MANAGE_CT_HEADERS_TABLE]: getters.getHeadersTable
  },
  mutations: {
    [MANAGE_CT_DIALOG]: mutations.setDialog,
    [MANAGE_CT_EDITED_INDEX]: mutations.setEditedIndex,
    [MANAGE_CT_CONTENT_TYPES]: mutations.setContentTypes,
    [MANAGE_CT_EDITED_ITEM]: mutations.setEditedItem,
    [MANAGE_CT_EDITED_ITEM_DEFAULT]: mutations.setEditedItemDefault,
    [MANAGE_CT_ADD_FIELD]: mutations.addMoreField,
    [MANAGE_CT_REMOVE_FIELD]: mutations.removeField,
    [MANAGE_CT_FIELDS_ITEM]: mutations.setFieldsItem,
    [MANAGE_CT_FIELDS_ITEM_DEFAULT]: mutations.setFieldsItemDefault,
    [MANAGE_CT_DIALOG_FORM]: mutations.setDialogForm
  },
  actions: {
    [MANAGE_CT_CONTENT_TYPES]: actions.getContentType,
    [MANAGE_CT_SET_CONTENT_TYPE]: actions.setContentType,
    [MANAGE_CT_REMOVE_CONTENT_TYPE]: actions.removeContentType
  }
};
