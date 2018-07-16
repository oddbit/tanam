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
  EVENT_POST_SUBMIT,
  EVENT_POST_UPDATE,
  SET_POST,
  SET_POST_TO_NULL,
  DELETE_POST
} from '../types';
import mutations from './mutations';
import getters from './getters';
import actions from './actions';

const state = {
  title: null,
  featuredImage: null,
  permalink: null,
  body: null,
  status: null,
  createdAt: null,
  publishedAt: null,
  updatedAt: null,
  deletedAt: null
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
    [POST_TITLE]: mutations.setTitle,
    [POST_PLACE]: mutations.setPlace,
    [POST_DATE_START]: mutations.setDateStart,
    [POST_TIME_START]: mutations.setTimeStart,
    [POST_DATE_END]: mutations.setDateEnd,
    [POST_TIME_END]: mutations.setTimeEnd,
    [POST_PRICE_REGULAR]: mutations.setPriceRegular,
    [POST_PRICE_MEMBER]: mutations.setPriceMember,
    [POST_RSVP_EMAIL]: mutations.setRsvpEmail,
    [POST_RSVP_URL]: mutations.setRsvpUrl,
    [POST_RSVP_FACEBOOK]: mutations.setRsvpFacebook,
    [POST_FEATURED_IMAGE]: mutations.setFeaturedImage,
    [POST_PERMALINK]: mutations.setPermalink,
    [POST_CONTENT]: mutations.setContent,
    [SET_POST]: mutations.setPost,
    [SET_POST_TO_NULL]: mutations.setPostToNull
  },
  actions: {
    [EVENT_POST_SUBMIT]: actions.publishEvent,
    [EVENT_POST_UPDATE]: actions.updateEvent,
    [DELETE_POST]: actions.deleteEvent
  }
};
