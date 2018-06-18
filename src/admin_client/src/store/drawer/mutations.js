const toggleDrawer = (state, payload) => (state.status = payload);

const toggleDrawerEventPost = (state, payload) => {
  state.statusEventPost =
    payload !== undefined ? payload : !state.statusEventPost;
};

export default {
  toggleDrawer,
  toggleDrawerEventPost
};
