import firebase from 'firebase/app';
import 'firebase/database';

const getPublishedEvents = async () => {
  const publishedEventsRef = firebase
    .database()
    .ref('/posts/events')
    .orderByChild('status')
    .equalTo('published');
  const snapshot = await publishedEventsRef.once('value');
  return snapshot;
};

const getDraftEvents = async () => {
  const draftEventsRef = firebase
    .database()
    .ref('/posts/events')
    .orderByChild('status')
    .equalTo('draft');
  const snapshot = await draftEventsRef.once('value');
  return snapshot;
};

export default {
  getPublishedEvents,
  getDraftEvents
};
