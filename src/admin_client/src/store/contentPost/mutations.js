const setPublishedPosts = (state, payload) => {
  state.contentTypePost = payload;
};

const setUnPublishedPosts = (state, payload) => {
  state.contentTypeDraft = payload;
};

export default {
  setPublishedPosts,
  setUnPublishedPosts
};
