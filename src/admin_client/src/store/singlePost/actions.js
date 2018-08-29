import { firestore, storageRef } from '@/utils/firebase';
import metadata from '@/helpers/metadata';
import quillToHtml from '@/helpers/quillToHtml';
import contentType from '@/utils/contentType';
import { POST_CONTENT_TYPE, POST_FIELD_FEATURED_IMAGE } from '@/store/types';

const collectionRef = (collectionName, newPost = false, uid = null) => {
  const collection = firestore.collection(collectionName);
  return newPost ? collection.doc() : collection.doc(uid);
};

const uploadFeaturedImage = async (imgName, featuredImage) => {
  try {
    const imgRef = storageRef.child(`content/images/${imgName}`);
    await imgRef.putString(featuredImage, 'data_url');
  } catch (error) {
    throw new Error(error);
  }
};

const publishPost = ({ state, getters }) => {
  const { body, title, template, featuredImage, tags } = state;

  return new Promise(async (resolve, reject) => {
    const docRef = collectionRef(getters[POST_CONTENT_TYPE], true);

    let imgName;
    const properties = {
      data: {
        body: quillToHtml(body),
        title
      },
      path: metadata.generatePaths(title, template),
      publishTime: new Date(),
      updateTime: new Date(),
      status: 'published',
      template,
      tags
    };

    if (featuredImage) {
      imgName = metadata.generateFeaturedImageName(title);
      await uploadFeaturedImage(imgName, featuredImage);
      properties.data.featuredImage = imgName;
    }

    try {
      await docRef.set(properties);
      resolve();
    } catch (error) {
      reject(error);
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
          .collection(getters[POST_CONTENT_TYPE])
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
          .collection(getters[POST_CONTENT_TYPE])
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
  const featuredImagePath = getters[POST_FIELD_FEATURED_IMAGE];
  return new Promise(async (resolve, reject) => {
    if (featuredImagePath) {
      const imageRef = storageRef.child(featuredImagePath);
      try {
        await imageRef.delete();
        await firestore
          .collection(getters[POST_CONTENT_TYPE])
          .doc(payload)
          .delete();
        resolve();
      } catch (error) {
        reject();
      }
    } else {
      try {
        await firestore
          .collection(getters[POST_CONTENT_TYPE])
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
