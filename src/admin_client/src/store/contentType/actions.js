import { CONTENT_TYPES_GET } from '@/store/types';
import { rtdb } from '@/utils/firebase';

export const dispatchContentTypes = ({ commit }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const snapshot = await rtdb.ref('contentTypes').once('value');
      const fields = snapshot.val();
      commit(CONTENT_TYPES_GET, fields);
      resolve(fields);
    } catch (error) {
      reject(error);
    }
  });
};
