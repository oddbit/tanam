import createPermalink from '@/helpers/createPermalink';

const setTitle = (state, payload) => {
  state.title = payload;
  state.permalink = payload ? createPermalink(payload) : null;
};
const setFeaturedImage = (state, payload) => (state.featuredImage = payload);
const setPermalink = (state, payload) => (state.permalink = payload);
const setContent = (state, payload) => (state.content = payload);

const setPost = (state, payload) => {
  const keys = Object.keys(payload);
  keys.forEach(key => {
    state[key] = payload[key];
  });
};

const setPostToNull = state => {
  const keys = Object.keys(state);
  keys.forEach(key => {
    state[key] = null;
  });
};

export default {
  setTitle,
  setFeaturedImage,
  setPermalink,
  setContent,
  setPost,
  setPostToNull
};
