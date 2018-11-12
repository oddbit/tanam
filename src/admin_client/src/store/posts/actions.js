import { firestore, storage } from '@/utils/firebase';
import { POST_PUBLISHED, POST_UNPUBLISHED } from '../types';
import metadata from '@/helpers/metadata';

const collectionRef = (collectionName, newPost = true, uid = null) => {
  const collection = firestore.collection(`ct-${collectionName}`);
  return newPost ? collection.doc() : collection.doc(uid);
};

const handleImageFiles = (imageFiles, postID) => {
  return new Promise(async (resolve, reject) => {
    if (Object.keys(imageFiles).length <= 0) {
      resolve(null);
    } else {
      let imageObj = {};
      for (const key in imageFiles) {
        if (!imageFiles[key]) {
          imageObj[key] = null;
        } else {
          const imageName = `${postID}-${imageFiles[key].name}`;
          const imgRef = storage.ref('/content/postImages/').child(imageName);
          try {
            await imgRef.put(imageFiles[key]);
            const url = await imgRef.getDownloadURL();
            imageObj[key] = {
              url: url,
              path: `/content/postImages/${imageName}`
            };
          } catch (error) {
            reject(error);
          }
        }
      }
      resolve(imageObj);
    }
  });
};

const handleProperties = (
  isEditedMode,
  postPermalink,
  postStatus,
  postFields,
  imgObj
) => {
  const path = metadata.generatePaths(postPermalink, null);

  return {
    data: {
      ...postFields,
      ...imgObj
    },
    path: path,
    permalink: postPermalink,
    ...(!isEditedMode
      ? {
          publishTime: new Date()
        }
      : null),
    updateTime: new Date(),
    status: isEditedMode ? postStatus : 'published',
    template: null
  };
};

export const publishPost = (
  { state },
  { contentType, postFields, imageFiles, uid }
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let docRef;
      if (state.isEditedMode) {
        docRef = collectionRef(contentType, false, uid);
      } else {
        docRef = collectionRef(contentType);
      }
      const imgObj = await handleImageFiles(imageFiles, docRef.id);
      const props = handleProperties(
        state.isEditedMode,
        state.postPermalink,
        state.postStatus,
        postFields,
        imgObj
      );
      await docRef.set(props, {
        merge: true
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const deletePost = ({ state }, payload) => {
  let publishedPost = state.postsPublished;

  // Get object to delete
  let result = publishedPost.filter(obj => {
    return obj.key === payload.postId;
  });
  let data = result[0].data; // Object to delete

  // Delete from firestore
  firestore
    .collection(`ct-${payload.ctKey}`)
    .doc(payload.postId)
    .delete();

  // Get all image path
  var imagesPath = []; // Path image to delete
  for (var key in data) {
    if (data[key].hasOwnProperty('path')) {
      imagesPath.push(data[key].path);
    }
  }

  // Delete all image
  if (imagesPath.length != 0) deleteImages(imagesPath);
  async function deleteImages(array) {
    for (const path of array) {
      await storage
        .ref()
        .child(path)
        .delete();
    }
  }
};

export const getPublishedPost = ({ commit }, payload) => {
  firestore
    .collection(`ct-${payload}`)
    .where('status', '==', 'published')
    .onSnapshot(snapshot => {
      const arr = [];
      commit(POST_PUBLISHED, []);
      snapshot.forEach(doc => {
        arr.push({
          ...doc.data(),
          key: doc.id
        });
      });
      commit(POST_PUBLISHED, arr);
    });
};

export const getUnpublishedPost = ({ commit }, payload) => {
  firestore
    .collection(`ct-${payload}`)
    .where('status', '==', 'unpublished')
    .onSnapshot(snapshot => {
      const arr = [];
      commit(POST_UNPUBLISHED, []);
      snapshot.forEach(doc => {
        arr.push({
          ...doc.data(),
          key: doc.id
        });
      });
      commit(POST_UNPUBLISHED, arr);
    });
};

export const getSinglePost = (ctx, { ctKey, postID }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await firestore
        .collection(`ct-${ctKey}`)
        .doc(postID)
        .get();
      if (doc.exists) {
        resolve(doc.data());
      } else {
        reject();
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const updatePostToPublish = (ctx, payload) => {
  firestore
    .collection(`ct-${payload.ctKey}`)
    .doc(payload.postId)
    .update({
      status: 'published'
    });
};
