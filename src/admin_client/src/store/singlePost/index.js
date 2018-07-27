import {
  POST_FIELD_TITLE,
  POST_FIELD_PLACE,
  POST_FIELD_DATE_START,
  POST_FIELD_TIME_START,
  POST_FIELD_DATE_END,
  POST_FIELD_TIME_END,
  POST_FIELD_PRICE_REGULAR,
  POST_FIELD_PRICE_MEMBER,
  POST_FIELD_RSVP_EMAIL,
  POST_FIELD_RSVP_URL,
  POST_FIELD_RSVP_FACEBOOK,
  POST_FIELD_FEATURED_IMAGE,
  POST_FIELD_PERMALINK,
  POST_FIELD_BODY,
  POST_ACTION_SUBMIT,
  POST_ACTION_UPDATE,
  POST_SET_POSTS,
  POST_ACTION_DELETE,
  POST_VALIDATE_TITLE,
  POST_FIELD_FEATURED_IMAGE_PATH
} from '../types';
import mutations from './mutations';
import getters from './getters';
import actions from './actions';

const state = {
  title: null,
  place: null,
  datetimeStart: {
    date: null,
    time: null
  },
  datetimeEnd: {
    date: null,
    time: null
  },
  priceRegular: null,
  priceMember: null,
  rsvpEmail: null,
  rsvpUrl: null,
  rsvpFacebook: null,
  featuredImage: {
    fullPath: null,
    url: null
  },
  permalink: null,
  body: null,
  createdAt: null,
  publishedAt: null,
  updatedAt: null,
  deletedAt: null,
  status: null,
  validTitle: false
};

export default {
  state,
  getters: {
    [POST_FIELD_TITLE]: getters.title,
    [POST_FIELD_PLACE]: getters.place,
    [POST_FIELD_DATE_START]: getters.dateStart,
    [POST_FIELD_TIME_START]: getters.timeStart,
    [POST_FIELD_DATE_END]: getters.dateEnd,
    [POST_FIELD_TIME_END]: getters.timeEnd,
    [POST_FIELD_PRICE_REGULAR]: getters.priceRegular,
    [POST_FIELD_PRICE_MEMBER]: getters.priceMember,
    [POST_FIELD_RSVP_EMAIL]: getters.rsvpEmail,
    [POST_FIELD_RSVP_URL]: getters.rsvpUrl,
    [POST_FIELD_RSVP_FACEBOOK]: getters.rsvpFacebook,
    [POST_FIELD_FEATURED_IMAGE]: getters.featuredImage,
    [POST_FIELD_FEATURED_IMAGE_PATH]: getters.featuredImagePath,
    [POST_FIELD_PERMALINK]: getters.permalink,
    [POST_FIELD_BODY]: getters.body,
    [POST_VALIDATE_TITLE]: getters.validTitle
  },
  mutations: {
    [POST_FIELD_TITLE]: mutations.title,
    [POST_FIELD_PLACE]: mutations.place,
    [POST_FIELD_DATE_START]: mutations.dateStart,
    [POST_FIELD_TIME_START]: mutations.timeStart,
    [POST_FIELD_DATE_END]: mutations.dateEnd,
    [POST_FIELD_TIME_END]: mutations.timeEnd,
    [POST_FIELD_PRICE_REGULAR]: mutations.priceRegular,
    [POST_FIELD_PRICE_MEMBER]: mutations.priceMember,
    [POST_FIELD_RSVP_EMAIL]: mutations.rsvpEmail,
    [POST_FIELD_RSVP_URL]: mutations.rsvpUrl,
    [POST_FIELD_RSVP_FACEBOOK]: mutations.rsvpFacebook,
    [POST_FIELD_FEATURED_IMAGE]: mutations.featuredImage,
    [POST_FIELD_FEATURED_IMAGE_PATH]: mutations.featuredImagePath,
    [POST_FIELD_PERMALINK]: mutations.permalink,
    [POST_FIELD_BODY]: mutations.body,
    [POST_SET_POSTS]: mutations.post,
    [POST_VALIDATE_TITLE]: mutations.validateTitle
  },
  actions: {
    [POST_ACTION_SUBMIT]: actions.publishPost,
    [POST_ACTION_UPDATE]: actions.updatePost,
    [POST_ACTION_DELETE]: actions.deletePost
  }
};
