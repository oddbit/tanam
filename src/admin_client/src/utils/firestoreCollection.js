import { POST_CONTENT_TYPE } from '@/store/types';
import { event, blog } from '@/config/post';

export const collection = getters => {
  return getters[POST_CONTENT_TYPE] === event.contentType
    ? event.firestore
    : blog.firestore;
};
