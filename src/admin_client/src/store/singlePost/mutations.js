import createPermalink from '@/helpers/createPermalink';

const title = (state, payload) => {
  state.title = payload;
  state.permalink = payload ? createPermalink(payload) : null;
  validateTitle(state);
};

const place = (state, payload) => (state.place = payload);

const dateStart = (state, payload) =>
  (state.datetimeStart = { ...state.datetimeStart, date: payload });

const timeStart = (state, payload) =>
  (state.datetimeStart = { ...state.datetimeStart, time: payload });

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

const body = (state, payload) => (state.body = payload);

const post = (state, payload) => {
  if (payload) {
    const keys = Object.keys(payload);
    keys.forEach(key => {
      state[key] = payload[key];
    });
    validateTitle(state);
  } else {
    const keys = Object.keys(state);
    keys.forEach(key => {
      state[key] = null;
    });
    validateTitle(state);
  }
};

const validateTitle = state => {
  if (state.title) {
    state.validTitle = true;
  } else {
    state.validTitle = false;
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
  body,
  post,
  validateTitle
};
