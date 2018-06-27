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
  state.dialogDelete = payload.dialogDelete;
  state.postID = payload.id || null;
};

export default {
  setPostID,
  setPublishedEvents,
  setDraftEvents,
  setDialogDelete
};
