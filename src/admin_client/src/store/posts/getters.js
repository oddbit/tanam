const getPostID = state => state.postID;

const getPublishedEvent = state => state.publishedEvents;

const getDraftEvent = state => state.draftEvents;

const getDialogDelete = state => state.dialogDelete;

export default {
  getPostID,
  getPublishedEvent,
  getDraftEvent,
  getDialogDelete
};
