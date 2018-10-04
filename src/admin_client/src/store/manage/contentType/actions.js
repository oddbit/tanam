import { rtdb } from '@/utils/firebase';
import { MANAGE_CT_CONTENT_TYPES } from '@/store/types';

export const setContentType = ({ state }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (state.editedItem.icon === '') {
        state.editedItem.icon = 'insert_drive_file';
      }
      await rtdb.ref(`contentTypes/${state.editedItem.name}`).set({
        fields: state.fieldsItem,
        meta: state.editedItem
      });
      resolve();
    } catch (error) {
      reject();
    }
  });
};

export const getContentType = ({ commit }) => {
  rtdb.ref('contentTypes/').on('value', snapshot => {
    const docs = snapshot.val();
    const newDocs = Object.keys(docs).map(key => docs[key]);
    commit(MANAGE_CT_CONTENT_TYPES, newDocs);
  });
};

export const removeContentType = (ctx, payload) => {
  rtdb.ref('contentTypes/' + payload).remove();
};
