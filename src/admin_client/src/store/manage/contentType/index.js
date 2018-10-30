import {
  CONTENT_TYPE_DIALOG,
  CONTENT_TYPE_EDITED_INDEX,
  CONTENT_TYPE_GET,
  CONTENT_TYPE_EDITED_ITEM,
  CONTENT_TYPE_ADD_FIELD,
  CONTENT_TYPE_FIELDS_ITEM,
  CONTENT_TYPE_FIELD_TYPE_ITEMS,
  CONTENT_TYPE_REMOVE_FIELD,
  CONTENT_TYPE_EDITED_ITEM_DEFAULT,
  CONTENT_TYPE_HEADERS_TABLE,
  CONTENT_TYPE_FIELDS_ITEM_DEFAULT,
  CONTENT_TYPE_DIALOG_FORM,
  CONTENT_TYPE_SET_CONTENT_TYPE,
  CONTENT_TYPE_REMOVE_CONTENT_TYPE,
  CONTENT_TYPE_GET_ARRAY
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
    { key: '', name: '', type: '', item: [] }
  ],
  fieldsItemDefault: [
    { key: 'title', name: 'Title', type: 'text', pk: true },
    { key: '', name: '', type: '', item: [] }
  ],
  fieldTypeItems: [
    { text: 'Text', value: 'text' },
    { text: 'Textarea', value: 'textarea' },
    { text: 'Number', value: 'number' },
    { text: 'List', value: 'list' },
    { text: 'Select', value: 'select', item: [] },
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
  contentType: null
};

export default {
  state,
  getters: {
    [CONTENT_TYPE_DIALOG]: getters.getDialog,
    [CONTENT_TYPE_EDITED_INDEX]: getters.getEditedIndex,
    [CONTENT_TYPE_GET]: getters.getContentType,
    [CONTENT_TYPE_EDITED_ITEM]: getters.getEditedItem,
    [CONTENT_TYPE_FIELDS_ITEM]: getters.getFieldsItem,
    [CONTENT_TYPE_FIELD_TYPE_ITEMS]: getters.getFieldTypeItems,
    [CONTENT_TYPE_HEADERS_TABLE]: getters.getHeadersTable,
    [CONTENT_TYPE_GET_ARRAY]: getters.getContentTypeArray
  },
  mutations: {
    [CONTENT_TYPE_DIALOG]: mutations.setDialog,
    [CONTENT_TYPE_EDITED_INDEX]: mutations.setEditedIndex,
    [CONTENT_TYPE_GET]: mutations.setContentTypes,
    [CONTENT_TYPE_EDITED_ITEM]: mutations.setEditedItem,
    [CONTENT_TYPE_EDITED_ITEM_DEFAULT]: mutations.setEditedItemDefault,
    [CONTENT_TYPE_ADD_FIELD]: mutations.addMoreField,
    [CONTENT_TYPE_REMOVE_FIELD]: mutations.removeField,
    [CONTENT_TYPE_FIELDS_ITEM]: mutations.setFieldsItem,
    [CONTENT_TYPE_FIELDS_ITEM_DEFAULT]: mutations.setFieldsItemDefault,
    [CONTENT_TYPE_DIALOG_FORM]: mutations.setDialogForm
  },
  actions: {
    [CONTENT_TYPE_GET]: actions.getContentType,
    [CONTENT_TYPE_SET_CONTENT_TYPE]: actions.setContentType,
    [CONTENT_TYPE_REMOVE_CONTENT_TYPE]: actions.removeContentType
  }
};
