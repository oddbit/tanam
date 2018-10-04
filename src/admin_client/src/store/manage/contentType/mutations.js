export const setDialog = (state, payload) => (state.dialog = payload);

export const setEditedIndex = (state, payload) => (state.editedIndex = payload);

export const setContentTypes = (state, payload) => {
  state.contentTypes = payload;
};

export const setEditedItem = (state, payload) => (state.editedItem = payload);

export const setEditedItemDefault = state =>
  (state.editedItem = [{ name: '', title: '', icon: '' }]);

export const addMoreField = state =>
  state.fieldsItem.push({ name: '', title: '', type: '' });
export const removeField = (state, index) => state.fieldsItem.splice(index, 1);

export const setFieldsItem = (state, payload) => (state.fieldsItem = payload);

export const setFieldsItemDefault = state =>
  (state.fieldsItem = [{ name: '', title: '', type: '' }]);

export const setDialogForm = (state, payload) => {
  state.editedItem = payload.editedItem;
  state.fieldsItem = payload.fieldsItem;
};
