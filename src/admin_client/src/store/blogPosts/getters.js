const getPostID = state => state.postID;

const getPublishedBlogs = state => state.publishedBlogs;

const getDraftBlogs = state => state.draftBlogs;

const getDialogDelete = state => state.dialogDelete;

export default {
  getPostID,
  getPublishedBlogs,
  getDraftBlogs,
  getDialogDelete
};
