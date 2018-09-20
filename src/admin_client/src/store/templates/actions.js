import { contentImages, storageRef, contentTypes } from '@/utils/firebase';
import { TEMPLATE_IMAGES, TEMPLATE_CONTENTTYPES } from '../types';

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

const getContentTypes = async ({ commit }) => {
  const contentTypesSnapshots = await contentTypes;
  console.log(contentTypesSnapshots.val())
  // const arrContentTypes = [];
  // contentTypesSnapshots.forEach(e => {
  //   var header = e.key
  //     .toLowerCase()
  //     .split(' ')
  //     .map(s => s.charAt(0).toUpperCase() + s.substring(1))
  //     .join(' ');
  //   arrContentTypes.push({
  //     val: e.val(),
  //     header: header,
  //     link: e.key
  //   });
  // });
  // console.log(arrContentTypes);
  return commit(TEMPLATE_CONTENTTYPES, contentTypesSnapshots.val());
};

export default {
  getImages,
  getContentTypes
};
