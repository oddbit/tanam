import {
  POST_TITLE,
  POST_PLACE,
  POST_DATE_START,
  POST_TIME_START,
  POST_DATE_END,
  POST_TIME_END,
  POST_PRICE_REGULAR,
  POST_PRICE_MEMBER,
  POST_RSVP_EMAIL,
  POST_RSVP_URL,
  POST_RSVP_FACEBOOK,
  POST_FEATURED_IMAGE,
  POST_PERMALINK,
  POST_CONTENT,
  POST_ACTION_SUBMIT,
  POST_ACTION_UPDATE,
  POST_SET,
  POST_ACTION_DELETE
} from '../types';
import mutations from './mutations';
import getters from './getters';
import actions from './actions';

const state = {
  title: null,
  place: null,
  dateStart: null,
  timeStart: null,
  dateEnd: null,
  timeEnd: null,
  priceRegular: null,
  priceMember: null,
  rsvpEmail: null,
  rsvpUrl: null,
  rsvpFacebook: null,
  featuredImage: null,
  permalink: null,
  content: null,
  createdAt: null,
  publishedAt: null,
  updatedAt: null,
  deletedAt: null,
  status: null
};

export default {
  state,
  getters: {
    [POST_TITLE]: getters.title,
    [POST_PLACE]: getters.place,
    [POST_DATE_START]: getters.dateStart,
    [POST_TIME_START]: getters.timeStart,
    [POST_DATE_END]: getters.dateEnd,
    [POST_TIME_END]: getters.timeEnd,
    [POST_PRICE_REGULAR]: getters.priceRegular,
    [POST_PRICE_MEMBER]: getters.priceMember,
    [POST_RSVP_EMAIL]: getters.rsvpEmail,
    [POST_RSVP_URL]: getters.rsvpUrl,
    [POST_RSVP_FACEBOOK]: getters.rsvpFacebook,
    [POST_FEATURED_IMAGE]: getters.featuredImage,
    [POST_PERMALINK]: getters.permalink,
    [POST_CONTENT]: getters.content
  },
  mutations: {
    [POST_TITLE]: mutations.title,
    [POST_PLACE]: mutations.place,
    [POST_DATE_START]: mutations.dateStart,
    [POST_TIME_START]: mutations.timeStart,
    [POST_DATE_END]: mutations.dateEnd,
    [POST_TIME_END]: mutations.timeEnd,
    [POST_PRICE_REGULAR]: mutations.priceRegular,
    [POST_PRICE_MEMBER]: mutations.priceMember,
    [POST_RSVP_EMAIL]: mutations.rsvpEmail,
    [POST_RSVP_URL]: mutations.rsvpUrl,
    [POST_RSVP_FACEBOOK]: mutations.rsvpFacebook,
    [POST_FEATURED_IMAGE]: mutations.featuredImage,
    [POST_PERMALINK]: mutations.permalink,
    [POST_CONTENT]: mutations.content,
    [POST_SET]: mutations.post
  },
  actions: {
    [POST_ACTION_SUBMIT]: actions.publishPost,
    [POST_ACTION_UPDATE]: actions.updatePost,
    [POST_ACTION_DELETE]: actions.deletePost
  }
};
