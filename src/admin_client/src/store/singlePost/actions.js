import firestore from '@/utils/firestore';
import storageRef, { child } from '@/utils/storageRef';
import quillToHtml from '@/helpers/quillToHtml';
import { collection } from '@/utils/firestoreCollection';
import contentType from '@/utils/contentType';
import { POST_FIELD_FEATURED_IMAGE_PATH } from '@/store/types';

const publishPost = ({ state, getters }) => {
  const body = quillToHtml(state.body);
  const publishedAt = new Date().toISOString();

  return new Promise(async (resolve, reject) => {
    if (state.featuredImage && state.featuredImage.url) {
      try {
        const docRef = firestore.collection(collection(getters)).doc();
        const imageRef = storageRef.child(`${child(getters)}/${docRef.id}`);
        const snapshot = await imageRef.putString(
          state.featuredImage.url,
          'data_url'
        );
        const downloadUrl = await imageRef.getDownloadURL();
        await docRef.set({
          ...contentType(state, getters),
          featuredImage: { fullPath: snapshot.ref.fullPath, url: downloadUrl },
          body,
          publishedAt,
          status: 'published'
        });
        resolve();
      } catch (error) {
        reject();
      }
    } else {
      try {
        await firestore.collection(collection(getters)).add({
          ...contentType(state, getters),
          featuredImage: { fullPath: null, url: null },
          body,
          publishedAt,
          status: 'published'
        });
        resolve();
      } catch (error) {
        reject();
      }
    }
  });
};

const updatePost = ({ state, getters }, payload) => {
  const body = quillToHtml(state.body);
  const updatedAt = new Date().toISOString();

  return new Promise(async (resolve, reject) => {
    if (state.featuredImage && state.featuredImage.url) {
      try {
        const imageRef = await storageRef.child(`${child(getters)}/${payload}`);
        const snapshot = await imageRef.putString(
          state.featuredImage.url,
          'data_url'
        );
        const downloadUrl = await imageRef.getDownloadURL();
        await firestore
          .collection(collection(getters))
          .doc(payload)
          .update({
            ...contentType(state, getters),
            featuredImage: {
              fullPath: snapshot.ref.fullPath,
              url: downloadUrl
            },
            body,
            updatedAt
          });
        resolve();
      } catch (error) {
        reject();
      }
    } else {
      try {
        await firestore
          .collection(collection(getters))
          .doc(payload)
          .update({
            ...contentType(state, getters),
            body,
            updatedAt
          });
        resolve();
      } catch (error) {
        reject();
      }
    }
  });
};

const deletePost = async ({ getters }, payload) => {
  const featuredImagePath = getters[POST_FIELD_FEATURED_IMAGE_PATH];
  return new Promise(async (resolve, reject) => {
    if (featuredImagePath) {
      const imageRef = storageRef.child(featuredImagePath);
      try {
        await imageRef.delete();
        await firestore
          .collection(collection(getters))
          .doc(payload)
          .delete();
        resolve();
      } catch (error) {
        reject();
      }
    } else {
      try {
        await firestore
          .collection(collection(getters))
          .doc(payload)
          .delete();
        resolve();
      } catch (error) {
        reject();
      }
    }
  });
};

export default {
  publishPost,
  updatePost,
  deletePost
};
