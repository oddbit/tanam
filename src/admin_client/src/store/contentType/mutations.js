export const commitNames = (state, payload) => (state.names = payload);

export const commitFields = (state, payload) =>
  (state.fields = { ...state.fields, ...payload });
