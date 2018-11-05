import { rtdb } from '@/utils/firebase';
import { CONTENT_TYPE_GET } from '@/store/types';

const modifyContentTypeBeforeSave = async (ct, fields) => {
  if (ct.icon === '' || !ct.icon) {
    ct.icon = 'insert_drive_file';
    ct._v = true;
  }

  const newFields = Object.keys(fields).map(key => {
    return {
      ...fields[key],
      _v: true,
      key: fields[key].key.charAt(0).toLowerCase() + fields[key].key.substr(1)
    };
  });

  return { ct, newFields };
};

export const setContentType = ({ state }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const ct = await modifyContentTypeBeforeSave(
        state.editedItem,
        state.fieldsItem
      );
      await rtdb.ref(`contentTypes/${state.editedItem.key}`).set({
        fields: ct.newFields,
        meta: ct.ct
      });
      resolve();
    } catch (error) {
      reject();
    }
  });
};

export const getContentType = ({ commit }) => {
  rtdb.ref('contentTypes/').on('value', snapshot => {
    commit(CONTENT_TYPE_GET, snapshot.val());
  });
};

export const removeContentType = (ctx, payload) => {
  rtdb.ref('contentTypes/' + payload).remove();
};
