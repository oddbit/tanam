import { CONTENT_TYPE_NAMES, CONTENT_TYPE_FIELDS } from '@/store/types';
import { rtdb } from '@/utils/firebase';

export const dispatchNames = ({ commit }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const snapshot = await rtdb.ref('contentTypes/names').once('value');
      const names = snapshot.val();
      commit(CONTENT_TYPE_NAMES, names);
      resolve(names);
    } catch (error) {
      reject(error);
    }
  });
};

export const dispatchFields = ({ commit }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const snapshot = await rtdb.ref('contentTypes/fields').once('value');
      const fields = snapshot.val();
      commit(CONTENT_TYPE_FIELDS, fields);
      resolve(fields);
    } catch (error) {
      reject(error);
    }
  });
};
