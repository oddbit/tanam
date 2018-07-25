import firestore from '@/utils/firestore';
import quillToHtml from '@/helpers/quillToHtml';
import { collection } from '@/utils/firestoreCollection';
import contentType from '@/utils/contentType';

const publishPost = ({ state, getters }) => {
  const body = quillToHtml(state.body);
  const publishedAt = new Date().toISOString();

  firestore.collection(collection(getters)).add({
    ...contentType(state, getters),
    body,
    publishedAt,
    status: 'published'
  });
};

const updatePost = ({ state, getters }, payload) => {
  const body = quillToHtml(state.body);
  const updatedAt = new Date().toISOString();
  firestore
    .collection(collection(getters))
    .doc(payload)
    .update({ ...contentType(state, getters), body, updatedAt });
};

const deletePost = ({ getters }, payload) => {
  firestore
    .collection(collection(getters))
    .doc(payload)
    .delete();
};

export default {
  publishPost,
  updatePost,
  deletePost
};
