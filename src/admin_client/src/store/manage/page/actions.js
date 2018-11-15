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
  console.log(status);

  return {
    data: {
      title,
      description
    },
    path: path,
    permalink: `/${pathName}`,
    ...(!isEditedMode
      ? {
          publishTime: new Date()
        }
      : null),
    updateTime: new Date(),
    status: status ? 'published' : 'unpublished',
    template: templateName
  };
};

export const createPage = (ctx, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pageProps = handleProperties(payload);
      await collectionRef('pages').set(pageProps, { merge: true });
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

export const getPage = (ctx, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const snapshot = await firestore
        .collection('pages')
        .doc(payload)
        .get();
      resolve(snapshot.data());
    } catch (error) {
      reject(error);
    }
  });
};
