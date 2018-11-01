export const getDialog = state => state.dialog;
export const getEditedIndex = state => state.editedIndex;
export const getContentType = state => state.contentType;
export const getEditedItem = state => state.editedItem;
export const getFieldsItem = state => state.fieldsItem;
export const getFieldTypeItems = state => state.fieldTypeItems;
export const getHeadersTable = state => state.headers;
export const getContentTypeArray = state => {
  if (state.contentType) {
    return Object.keys(state.contentType).map(key => state.contentType[key]);
  } else {
    return [];
  }
};
