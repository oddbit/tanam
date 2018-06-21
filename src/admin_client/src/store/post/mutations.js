import createPermalink from '@/helpers/createPermalink';

const setTitle = (state, payload) => {
  state.title = payload;
  state.permalink = payload ? createPermalink(payload) : null;
};
const setPlace = (state, payload) => (state.place = payload);
const setDateStart = (state, payload) => (state.dateStart = payload);
const setDateEnd = (state, payload) => (state.dateEnd = payload);
const setPriceRegular = (state, payload) => (state.priceRegular = payload);
const setPriceMember = (state, payload) => (state.priceMember = payload);
const setRsvpEmail = (state, payload) => (state.rsvpEmail = payload);
const setRsvpUrl = (state, payload) => (state.rsvpUrl = payload);
const setRsvpFacebook = (state, payload) => (state.rsvpFacebook = payload);
const setFeaturedImage = (state, payload) => (state.featuredImage = payload);
const setPermalink = (state, payload) => (state.permalink = payload);
const setContent = (state, payload) => (state.content = payload);

export default {
  setTitle,
  setPlace,
  setDateStart,
  setDateEnd,
  setPriceRegular,
  setPriceMember,
  setRsvpEmail,
  setRsvpUrl,
  setRsvpFacebook,
  setFeaturedImage,
  setPermalink,
  setContent
};
