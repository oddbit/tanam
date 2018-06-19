const title = state => state.title;
const place = state => state.place;
const dateStart = state => state.dateStart;
const dateEnd = state => state.dateEnd;
const priceRegular = state => state.priceRegular;
const priceMember = state => state.priceMember;
const rsvpEmail = state => state.rsvpEmail;
const rsvpUrl = state => state.rsvpUrl;
const rsvpFacebook = state => state.rsvpFacebook;
const featuredImage = state => state.featuredImage;
const permalink = state => state.permalink;

export default {
  title,
  place,
  dateStart,
  dateEnd,
  priceRegular,
  priceMember,
  rsvpEmail,
  rsvpUrl,
  rsvpFacebook,
  featuredImage,
  permalink
};
