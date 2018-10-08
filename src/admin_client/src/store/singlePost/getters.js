const title = state => state.title;
const place = state => state.place;
const dateStart = state =>
  state.datetimeStart ? state.datetimeStart.date : null;
const timeStart = state =>
  state.datetimeStart ? state.datetimeStart.time : null;
const dateEnd = state => (state.datetimeEnd ? state.datetimeEnd.date : null);
const timeEnd = state => (state.datetimeEnd ? state.datetimeEnd.time : null);
const priceRegular = state => state.priceRegular;
const priceMember = state => state.priceMember;
const rsvpEmail = state => state.rsvpEmail;
const rsvpUrl = state => state.rsvpUrl;
const rsvpFacebook = state => state.rsvpFacebook;
const featuredImage = state => state.featuredImage.src;
const permalink = state => state.permalink;
const body = state => state.body;
const validTitle = state => state.validTitle;
const uploadPost = state => state.uploadPost;

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
  validTitle
};
