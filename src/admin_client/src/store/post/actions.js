import firebase from 'firebase/app';
import 'firebase/database';
import quillToHtml from '@/helpers/quillToHtml';

const publishEvent = ({ state }) => {
  const content = quillToHtml(state.content);
  const publishedAt = new Date().toISOString();

  const postsEventsRef = firebase.database().ref('/posts/events');
  const newPostRef = postsEventsRef.push();
  newPostRef.set({
    ...state,
    content,
    publishedAt,
    status: 'published'
  });
};

const updateEvent = ({ state }, payload) => {
  const content = quillToHtml(state.content);
  const updatedAt = new Date().toISOString();

  firebase
    .database()
    .ref('/posts/events/' + payload)
    .set({ ...state, content, updatedAt });
};

const deleteEvent = (context, payload) => {
  firebase
    .database()
    .ref('/posts/events/' + payload)
    .remove();
};

export default {
  publishEvent,
  updateEvent,
  deleteEvent
};
