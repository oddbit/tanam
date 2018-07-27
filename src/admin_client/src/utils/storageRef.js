import firebase from 'firebase/app';
import 'firebase/storage';
import { POST_CONTENT_TYPE } from '@/store/types';
import { event, blog } from '@/config/post';

const storageRef = firebase.storage().ref();

export const child = getters =>
  getters[POST_CONTENT_TYPE] === 'event' ? event.storageName : blog.storageName;

export default storageRef;
