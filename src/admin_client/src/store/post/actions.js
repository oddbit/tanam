import firebase from 'firebase/app';
import 'firebase/database';
import quillToHtml from '@/helpers/quillToHtml';

const postsEventsRef = firebase.database().ref('/posts/events');

const submitEvent = ({ state }) => {
  const content = quillToHtml(state.content);
  const newPostRef = postsEventsRef.push();
  newPostRef.set({
    ...state,
    content
  });
};

export default {
  submitEvent
};
