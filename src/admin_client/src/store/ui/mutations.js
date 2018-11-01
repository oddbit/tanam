const toggleDrawer = (state, payload) => (state.status = payload);

const toggleDrawerPost = (state, payload) => {
  state.statusPost = payload !== undefined ? payload : !state.statusPost;
};

export default {
  toggleDrawer,
  toggleDrawerPost
};
