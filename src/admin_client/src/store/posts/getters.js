const getContentType = state => state.contentType;

const getPostId = state => state.postId;

const getPublishedPosts = state => state.publishedPosts;

const getDraftPosts = state => state.draftPosts;

const getDialogDelete = state => state.dialogDelete;

export default {
  getContentType,
  getPostId,
  getPublishedPosts,
  getDraftPosts,
  getDialogDelete
};
