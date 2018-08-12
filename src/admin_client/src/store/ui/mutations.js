const setBtnSubmitSinglePost = (state, payload) => {
  state.btnSubmitSinglePost = payload;
};

const setBtnDeleteSinglePost = (state, payload) => {
  state.btnDeleteSinglePost = payload;
};

export default {
  setBtnSubmitSinglePost,
  setBtnDeleteSinglePost
};
