const layout = (state, payload) => (state.layout = payload || 'DefaultLayout');

const postMode = (state, payload) => (state.postMode = payload || 'post');

export default {
  layout,
  postMode
};
