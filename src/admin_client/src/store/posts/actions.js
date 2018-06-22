import firebase from 'firebase/app';
import 'firebase/database';

const getPublishedEvents = async () => {
  const publishedEventsRef = firebase.database().ref('/posts/events/published');
  const snapshot = await publishedEventsRef.once('value');
  return snapshot;
};

export default {
  getPublishedEvents
};
