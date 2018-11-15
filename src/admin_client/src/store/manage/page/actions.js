import { firestore } from '@/utils/firebase';
import metadata from '@/helpers/metadata';
import { PAGE_FIELDS } from '@/store/types';

const collectionRef = (collectionName, newPage = true, uid = null) => {
  const collection = firestore.collection(collectionName);
  return newPage ? collection.doc() : collection.doc(uid);
};

const handleProperties = ({
  title,
  description,
  templateName,
  pathName,
  isEditedMode = false,
  status = 'published'
}) => {
  const path = metadata.generatePaths(pathName || templateName, 'page');

  return {
    data: {
      title,
      description
    },
    path: path,
    permalink: pathName,
    ...(!isEditedMode
      ? {
          publishTime: new Date()
        }
      : null),
    updateTime: new Date(),
    status: status,
    template: templateName
  };
};

export const savePage = (ctx, payload) => {
  return new Promise(async (resolve, reject) => {
    let docRef;
    if (payload.isEditedMode) {
      docRef = collectionRef('pages', false, payload.id);
    } else {
      docRef = collectionRef('pages');
    }

    try {
      const pageProps = handleProperties(payload);
      await docRef.set(pageProps, { merge: true });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const getPages = ({ commit }) => {
  firestore.collection('pages').onSnapshot(snapshot => {
    const arr = [];
    commit(PAGE_FIELDS, []);
    snapshot.forEach(doc => {
      arr.push({
        ...doc.data(),
        key: doc.id
      });
    });
    commit(PAGE_FIELDS, arr);
  });
};

export const deletePage = (ctx, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      await firestore
        .collection('pages')
        .doc(payload)
        .delete();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
