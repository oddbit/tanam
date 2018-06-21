import firebase from 'firebase/app';
import 'firebase/database';
import quillToHtml from '@/helpers/quillToHtml';

const publishEvent = ({ state }) => {
  const content = quillToHtml(state.content);
  const publishedAt = new Date().toISOString();

  const postsEventsRef = firebase.database().ref('/posts/events/published');
  const newPostRef = postsEventsRef.push();
  newPostRef.set({
    ...state,
    content,
    publishedAt
  });
};

export default {
  publishEvent
};
