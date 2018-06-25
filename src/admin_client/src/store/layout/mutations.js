const setLayout = (state, payload) =>
  (state.layout = payload || 'DefaultLayout');

const setPostMode = (state, payload) => (state.postMode = payload || 'post');

export default {
  setLayout,
  setPostMode
};
