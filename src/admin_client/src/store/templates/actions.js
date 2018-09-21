import { contentImages, storageRef } from '@/utils/firebase';
import { TEMPLATE_IMAGES } from '../types';

const getImages = async ({ commit }) => {
  const imageSnapshots = await contentImages;
  const imageRefs = [];
  imageSnapshots.forEach(image => {
    imageRefs.push(image.val());
  });
  const imageUrls = await Promise.all(
    imageRefs.map(async img => {
      const url = await storageRef.child(img.name).getDownloadURL();
      return url;
    })
  );

  return commit(TEMPLATE_IMAGES, imageUrls);
};

export default {
  getImages
};
