import { CONTENT_TYPES_NAMES, CONTENT_TYPES_FIELD } from '@/store/types';
import { rtdb } from '@/utils/firebase';

export const dispatchNames = ({ commit }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const snapshot = await rtdb.ref('contentTypes/names').once('value');
      const names = snapshot.val();
      commit(CONTENT_TYPES_NAMES, names);
      resolve(names);
    } catch (error) {
      reject(error);
    }
  });
};

export const dispatchField = ({ commit }, fieldName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const snapshot = await rtdb
        .ref('contentTypes/fields/' + fieldName)
        .once('value');
      const field = snapshot.val();
      commit(CONTENT_TYPES_FIELD, { [fieldName]: field });
      resolve(field);
    } catch (error) {
      reject(error);
    }
  });
};
