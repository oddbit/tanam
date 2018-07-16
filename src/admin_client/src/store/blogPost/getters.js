const title = state => state.title;
const place = state => state.place;
const dateStart = state => state.dateStart;
const timeStart = state => state.timeStart;
const dateEnd = state => state.dateEnd;
const timeEnd = state => state.timeEnd;
const priceRegular = state => state.priceRegular;
const priceMember = state => state.priceMember;
const rsvpEmail = state => state.rsvpEmail;
const rsvpUrl = state => state.rsvpUrl;
const rsvpFacebook = state => state.rsvpFacebook;
const featuredImage = state => state.featuredImage;
const permalink = state => state.permalink;
const content = state => state.content;

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
  content
};
