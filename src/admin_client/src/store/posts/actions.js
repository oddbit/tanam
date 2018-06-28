import firebase from 'firebase/app';
import 'firebase/database';
import { POST_SET, POST_PUBLISHED, POST_DRAFT } from '../types';

const getPublishedEvents = ({ commit }) => {
  const publishedEventsRef = firebase
    .database()
    .ref('/posts/events')
    .orderByChild('status')
    .equalTo('published');
  publishedEventsRef.on('value', snapshot => {
    const arr = [];
    commit(POST_PUBLISHED, []);
    snapshot.forEach(snap => {
      arr.push({ ...snap.val(), key: snap.key });
    });
    commit(POST_PUBLISHED, arr);
  });
};

const getDraftEvents = ({ commit }) => {
  const draftEventsRef = firebase
    .database()
    .ref('/posts/events')
    .orderByChild('status')
    .equalTo('draft');
  draftEventsRef.on('value', payload => {
    const arr = [];
    commit(POST_DRAFT, []);
    payload.forEach(snap => {
      arr.push({ ...snap.val(), key: snap.key });
    });
    commit(POST_DRAFT, arr);
  });
};

const getEventBy = async ({ commit }, payload) => {
  const eventRef = firebase.database().ref('/posts/events/' + payload);
  const snapshot = await eventRef.once('value');
  commit(POST_SET, snapshot.val());
};

export default {
  getPublishedEvents,
  getDraftEvents,
  getEventBy
};
