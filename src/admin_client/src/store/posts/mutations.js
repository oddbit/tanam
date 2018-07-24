const setContentType = (state, payload) => {
  state.contentType = payload;
};

const setPostId = (state, payload) => {
  state.postId = payload;
};

const setPublishedPosts = (state, payload) => {
  state.publishedPosts = payload;
};

const setDraftPosts = (state, payload) => {
  state.draftPosts = payload;
};

const setDialogDelete = (state, payload) => {
  state.dialogDelete = payload;
};

export default {
  setContentType,
  setPostId,
  setPublishedPosts,
  setDraftPosts,
  setDialogDelete
};
