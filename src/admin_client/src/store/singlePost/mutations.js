import createPermalink from '@/helpers/createPermalink';

const title = (state, payload) => {
  state.title = payload;
  state.permalink = payload ? createPermalink(payload) : null;
};
const place = (state, payload) => (state.place = payload);
// const dateStart = (state, payload) => (state.dateStart = payload);
// const timeStart = (state, payload) => (state.timeStart = payload);
const dateStart = (state, payload) =>
  (state.datetimeStart = { ...state.datetimeStart, date: payload });
const timeStart = (state, payload) =>
  (state.datetimeStart = { ...state.datetimeStart, time: payload });
// const dateEnd = (state, payload) => (state.dateEnd = payload);
// const timeEnd = (state, payload) => (state.timeEnd = payload);
const dateEnd = (state, payload) =>
  (state.datetimeEnd = { ...state.datetimeEnd, date: payload });
const timeEnd = (state, payload) =>
  (state.datetimeEnd = { ...state.datetimeEnd, time: payload });
const priceRegular = (state, payload) => (state.priceRegular = payload);
const priceMember = (state, payload) => (state.priceMember = payload);
const rsvpEmail = (state, payload) => (state.rsvpEmail = payload);
const rsvpUrl = (state, payload) => (state.rsvpUrl = payload);
const rsvpFacebook = (state, payload) => (state.rsvpFacebook = payload);
const featuredImage = (state, payload) => (state.featuredImage = payload);
const permalink = (state, payload) => (state.permalink = payload);
const content = (state, payload) => (state.content = payload);

const post = (state, payload) => {
  if (payload) {
    const keys = Object.keys(payload);
    keys.forEach(key => {
      state[key] = payload[key];
    });
  } else {
    const keys = Object.keys(state);
    keys.forEach(key => {
      state[key] = null;
    });
  }
};

export default {
  title,
  place,
  dateStart,
  timeStart,
  dateEnd,
  timeEnd,
  priceRegular,
  priceMember,
  rsvpEmail,
  rsvpUrl,
  rsvpFacebook,
  featuredImage,
  permalink,
  content,
  post
};
