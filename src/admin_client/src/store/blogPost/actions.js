import firestore from '@/utils/firestore';
import quillToHtml from '@/helpers/quillToHtml';

const publishPost = ({ state }) => {
  const content = quillToHtml(state.content);
  const publishedAt = new Date().toISOString();
  firestore
    .collection('posts-blogs')
    .add({ ...state, content, publishedAt, status: 'published' });
};

const updatePost = ({ state }, payload) => {
  const content = quillToHtml(state.content);
  const updatedAt = new Date().toISOString();
  firestore
    .collection('posts-blogs')
    .doc(payload)
    .update({ ...state, content, updatedAt });
};

const deletePost = (context, payload) => {
  firestore
    .collection('posts-blogs')
    .doc(payload)
    .delete();
};

export default {
  publishPost,
  updatePost,
  deletePost
};
