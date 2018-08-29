import { firestore, storageRef } from '@/utils/firebase';
import metadata from '@/helpers/metadata';
import quillToHtml from '@/helpers/quillToHtml';
import contentType from '@/utils/contentType';
import { POST_CONTENT_TYPE, POST_FIELD_FEATURED_IMAGE } from '@/store/types';

const collectionRef = (collectionName, newPost = true, uid = null) => {
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

const uploadPost = ({ state, getters, rootState }, payload) => {
  const { body, title, template, featuredImage, tags } = state;
  const {
    layout: { postMode }
  } = rootState;
  const permalink = metadata.generatePermalink(title);

  return new Promise(async (resolve, reject) => {
    let imgName;
    const properties = {
      data: {
        body: quillToHtml(body),
        title
      },
      path: metadata.generatePaths(permalink, template),
      permalink,
      publishTime: new Date(),
      updateTime: new Date(),
      status: 'published',
      template,
      tags
    };

    if (featuredImage.dataUri) {
      imgName = metadata.generateFeaturedImageName(permalink);
      await uploadFeaturedImage(imgName, featuredImage.src);
      properties.data.featuredImage = imgName;
    } else if (featuredImage.src) {
      properties.data.featuredImage = featuredImage.src;
    }

    try {
      let docRef;
      if (postMode === 'edit') {
        docRef = collectionRef(getters[POST_CONTENT_TYPE], false, payload);
        await docRef.set(properties, { merge: true });
      } else {
        docRef = collectionRef(getters[POST_CONTENT_TYPE]);
        await docRef.set(properties);
      }
      resolve();
    } catch (error) {
      reject(error);
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
  uploadPost,
  deletePost
};
