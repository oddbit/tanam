import { firestore, storage } from '@/utils/firebase';
import router from '@/router';
import { CONTENTTYPE_POST, CONTENTTYPE_DRAFT } from '../types';

const addPost = async ({ commit }, payload) => {
  var request = 0;
  var imageUrl = {};
  for (var key in payload.imageFile) {
    const imageName = `${payload.contentType}-${new Date().valueOf()}`;
    const imgRef = storage.ref('/content/images/').child(imageName);
    if (payload.imageFile.hasOwnProperty(key)) {
      console.log(key + ' -> ' + payload.imageFile[key]);
      await imgRef.put(payload.imageFile[key]).then(res => {
        console.log('uploaded');
        console.log(key);
        imageUrl[key] = request;
      });
      await imgRef.getDownloadURL().then(url => {
        imageUrl[key] = url;
        console.log(url);
      });
      request++;
      if (request === Object.keys(payload.imageFile).length) {
        console.log(imageUrl);
        console.log('Add post');
        firestore
          .collection(payload.contentType)
          .add({
            data: {
              ...payload.post,
              imageUrl: imageUrl
            },
            path: ['/staticpath', '/staticpath2'],
            permalink: 'staticpermalink',
            publishTime: new Date(),
            updateTime: new Date(),
            status: 'published',
            tags: ['statictags1', 'statictag2'],
            template: 'staticTemplate'
          })
          .then(res => {
            console.log('Post writed successfully');
            console.log(res);
            router.push(`/content-type/${payload.contentType}`);
          });
      }
    }
  }
};

const getPublishedPosts = ({ commit }, payload) => {
  firestore
    .collection(payload)
    .where('status', '==', 'published')
    .onSnapshot(snapshot => {
      const arr = [];
      commit(CONTENTTYPE_POST, []);
      snapshot.forEach(doc => {
        arr.push({
          ...doc.data(),
          key: doc.id
        });
      });
      commit(CONTENTTYPE_POST, arr);
    });
};

const getDraftPosts = ({ commit }, payload) => {
  firestore
    .collection(payload)
    .where('status', '==', 'draft')
    .onSnapshot(snapshot => {
      const arr = [];
      commit(CONTENTTYPE_DRAFT, []);
      snapshot.forEach(doc => {
        arr.push({
          ...doc.data(),
          key: doc.id
        });
      });
      commit(CONTENTTYPE_DRAFT, arr);
    });
};

export default {
  getPublishedPosts,
  getDraftPosts,
  addPost
};
