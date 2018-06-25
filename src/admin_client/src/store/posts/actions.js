import firebase from 'firebase/app';
import 'firebase/database';
import { SET_POST } from '../types';

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

const getEventBy = async ({ commit }, payload) => {
  const eventRef = firebase.database().ref('/posts/events/' + payload);
  const snapshot = await eventRef.once('value');
  commit(SET_POST, snapshot.val());
};

export default {
  getPublishedEvents,
  getDraftEvents,
  getEventBy
};
