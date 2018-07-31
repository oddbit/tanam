import { firestore } from '~/plugins/firebase';

export const state = () => ({
  eventPosts: []
});

export const getters = {
  getEventPosts(state) {
    return state.eventPosts;
  }
};
export const mutations = {
  setEventPosts(state, payload) {
    state.eventPosts = [];
    payload.forEach(doc => {
      state.eventPosts.push(doc.data());
    });
  }
};

export const actions = {
  async fetchEventPosts({ commit }) {
    const snapshot = await firestore.collection('posts-events').get();
    commit('setEventPosts', snapshot);
  }
};
