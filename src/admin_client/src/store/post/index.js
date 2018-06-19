import {
  POST_TITLE,
  POST_PLACE,
  POST_DATE_START,
  POST_DATE_END,
  POST_PRICE_REGULAR,
  POST_PRICE_MEMBER,
  POST_RSVP_EMAIL,
  POST_RSVP_URL,
  POST_RSVP_FACEBOOK,
  POST_FEATURED_IMAGE,
  POST_PERMALINK
} from '../types';
import mutations from './mutations';
import getters from './getters';

const state = {
  title: null,
  place: null,
  dateStart: null,
  dateEnd: null,
  priceRegular: 0,
  priceMember: 0,
  rsvpEmail: null,
  rsvpUrl: null,
  rsvpFacebook: null,
  featuredImage: null,
  permalink: null
};

export default {
  state,
  getters: {
    [POST_TITLE]: getters.title,
    [POST_PLACE]: getters.place,
    [POST_DATE_START]: getters.dateStart,
    [POST_DATE_END]: getters.dateEnd,
    [POST_PRICE_REGULAR]: getters.priceRegular,
    [POST_PRICE_MEMBER]: getters.priceMember,
    [POST_RSVP_EMAIL]: getters.rsvpEmail,
    [POST_RSVP_URL]: getters.rsvpUrl,
    [POST_RSVP_FACEBOOK]: getters.rsvpFacebook,
    [POST_FEATURED_IMAGE]: getters.featuredImage,
    [POST_PERMALINK]: getters.permalink
  },
  mutations: {
    [POST_TITLE]: mutations.setTitle,
    [POST_PLACE]: mutations.setPlace,
    [POST_DATE_START]: mutations.setDateStart,
    [POST_DATE_END]: mutations.setDateEnd,
    [POST_PRICE_REGULAR]: mutations.setPriceRegular,
    [POST_PRICE_MEMBER]: mutations.setPriceMember,
    [POST_RSVP_EMAIL]: mutations.setRsvpEmail,
    [POST_RSVP_URL]: mutations.setRsvpUrl,
    [POST_RSVP_FACEBOOK]: mutations.setRsvpFacebook,
    [POST_FEATURED_IMAGE]: mutations.setFeaturedImage,
    [POST_PERMALINK]: mutations.setPermalink
  }
};
