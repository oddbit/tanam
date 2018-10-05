import metadata from '@/helpers/metadata';

const validateTitle = state => {
  if (state.title) {
    state.validTitle = true;
  } else {
    state.validTitle = false;
  }
};

const title = (state, { title, contentType }) => {
  state.title = title;
  if (contentType !== 'pages') {
    state.permalink = metadata.generatePermalink(title);
  }
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
const template = (state, payload) => (state.template = payload);
const tags = (state, payload) => (state.tags = payload);

const body = (state, payload) => (state.body = payload);
const status = (state, payload) => (state.status = payload);

const post = (state, payload) => {
  const { data, status, ...rest } = payload;
  const postStatus = status === 'published';

  const incomingState = {
    ...data,
    ...rest,
    status: postStatus,
    featuredImage: {
      src: data.featuredImage,
      dataUri: false
    }
  };
  Object.keys(incomingState).forEach(key => {
    state[key] = incomingState[key];
  });
  validateTitle(state);
};

const uploadPost = (state, payload) => {
  state.uploadPost = payload;
  console.log('mutation');
};

export default {
  uploadPost,
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
  status,
  template,
  tags,
  post,
  validateTitle
};
