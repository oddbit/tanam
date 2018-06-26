const setPostID = (state, payload) => {
  state.postID = payload;
};

const setPublishedEvents = (state, payload) => {
  state.publishedEvents = payload;
};

const setDraftEvents = (state, payload) => {
  state.draftEvents = payload;
};

export default {
  setPostID,
  setPublishedEvents,
  setDraftEvents
};
