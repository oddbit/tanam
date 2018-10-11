import { generatePermalink } from '@/helpers/metadata';

export const setIsEditedMode = (state, payload) => {
  state.isEditedMode = payload ? payload : !state.isEditedMode;
};

export const setIsShowDrawer = (state, payload) => {
  state.isShowDrawer = payload ? payload : !state.isShowDrawer;
};

export const setIsSubmitting = (state, payload) => {
  state.isSubmitting = payload ? payload : !state.isSubmitting;
};

export const setPostsPublished = (state, payload) => {
  state.postsPublished = payload;
};

export const setPostsUnpublished = (state, payload) => {
  state.postsUnpublished = payload;
};

export const setPostTitle = (state, payload) => {
  state.postTitle = payload;
};

export const setPostPermalink = (state, payload) => {
  state.postPermalink = generatePermalink(payload);
};
