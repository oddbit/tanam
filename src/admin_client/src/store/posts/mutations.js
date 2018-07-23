const setPostID = (state, payload) => {
  state.postID = payload;
};

const setPublishedEvents = (state, payload) => {
  state.publishedEvents = payload;
};

const setDraftEvents = (state, payload) => {
  state.draftEvents = payload;
};

const setDialogDelete = (state, payload) => {
  state.dialogDelete = payload;
};

export default {
  setPostID,
  setPublishedEvents,
  setDraftEvents,
  setDialogDelete
};
