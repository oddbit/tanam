import { firestore } from '@/utils/firebase';
import {
  CONTENTTYPE_POST
  // POST_DRAFT,
  // POST_CONTENT_TYPE
} from '../types';

const getPublishedPosts = ({commit}) => {
  firestore
    .collection('event')
    .where('status', '==', 'published')
    .onSnapshot(snapshot => {
      console.log(snapshot)
      const arr = [];
      commit(CONTENTTYPE_POST, []);
      snapshot.forEach(doc => {
        console.log(doc.data())
        arr.push({ ...doc.data(), key: doc.id });
      });
      commit(CONTENTTYPE_POST, arr);
    });
};

// const getDraftPosts = ({ commit, getters }) => {
//   firestore
//     .collection(getters[POST_CONTENT_TYPE])
//     .where('status', '==', 'draft')
//     .onSnapshot(snapshot => {
//       const arr = [];
//       commit(POST_DRAFT, []);
//       snapshot.forEach(doc => {
//         arr.push({ ...doc.data(), key: doc.id });
//       });
//       commit(POST_DRAFT, arr);
//     });
// };

export default {
  getPublishedPosts
  // getDraftPosts,
  // getPostBy
};
