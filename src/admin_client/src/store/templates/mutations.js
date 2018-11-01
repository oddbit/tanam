const setImages = (state, payload) => {
  state.images = payload;
};

const setContentTypes = (state, payload) => {
  state.contentTypes = payload;
};

export default {
  setImages,
  setContentTypes
};
