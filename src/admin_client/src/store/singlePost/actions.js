import firebase from 'firebase/app';
import 'firebase/database';
import quillToHtml from '@/helpers/quillToHtml';

const publishPost = ({ state }) => {
  const content = quillToHtml(state.content);
  const publishedAt = new Date().toISOString();
  const ref = firebase
    .database()
    .ref('/posts/events')
    .push();
  ref.set({
    ...state,
    content,
    publishedAt,
    status: 'published'
  });
};

const updatePost = ({ state }, payload) => {
  const content = quillToHtml(state.content);
  const updatedAt = new Date().toISOString();
  firebase
    .database()
    .ref('/posts/events/' + payload)
    .set({ ...state, content, updatedAt });
};

const deletePost = (context, payload) => {
  firebase
    .database()
    .ref('/posts/events/' + payload)
    .remove();
};

export default {
  publishPost,
  updatePost,
  deletePost
};
