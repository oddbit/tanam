import { firestore } from '~/plugins/firebase';

export const state = () => ({
  blogPosts: []
});

export const getters = {
  getBlogPosts(state) {
    return state.blogPosts;
  }
};
export const mutations = {
  setBlogPosts(state, payload) {
    state.blogPosts = [];
    payload.forEach(doc => {
      state.blogPosts.push(doc.data());
    });
  }
};

export const actions = {
  async fetchBlogPosts({ commit }) {
    const snapshot = await firestore.collection('posts-blogs').get();
    commit('setBlogPosts', snapshot);
  }
};
