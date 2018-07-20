const setPostID = (state, payload) => {
  state.postID = payload;
};

const setPublishedBlogs = (state, payload) => {
  state.publishedBlogs = payload;
};

const setDraftBlogs = (state, payload) => {
  state.draftBlogs = payload;
};

const setDialogDelete = (state, payload) => {
  state.dialogDelete = payload.dialogDelete;
  state.postID = payload.id || null;
};

const setIsValidTitle = (state, payload) => {
  state.isValidTitle = payload;
};

export default {
  setPostID,
  setPublishedBlogs,
  setDraftBlogs,
  setDialogDelete,
  setIsValidTitle
};
