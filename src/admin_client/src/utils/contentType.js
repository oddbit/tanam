import { event, blog } from '@/config/post';
import { POST_CONTENT_TYPE } from '@/store/types';

export default (state, getters) => {
  const contentType = getters[POST_CONTENT_TYPE];
  const stateFields =
    contentType === 'event'
      ? { ...event.fields(state) }
      : { ...blog.fields(state) };
  return stateFields;
};
