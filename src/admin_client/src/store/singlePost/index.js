import {
  POST_RESET_STATE,
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
  POST_FIELD_STATUS,
  POST_ACTION_UPLOAD,
  POST_SET_POSTS,
  POST_ACTION_DELETE,
  POST_VALIDATE_TITLE,
  POST_FIELD_TEMPLATE,
  POST_FIELD_TAGS
} from '../types';
import mutations from './mutations';
import getters from './getters';
import actions from './actions';

const initialState = () => ({
  uploadPost: false,
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
    src: null,
    dataUri: false
  },
  permalink: null,
  template: null,
  tags: [],
  body: null,
  createdAt: null,
  publishedAt: null,
  updatedAt: null,
  deletedAt: null,
  status: null,
  validTitle: false
});

const state = initialState();

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
    [POST_FIELD_PERMALINK]: getters.permalink,
    [POST_FIELD_BODY]: getters.body,
    [POST_VALIDATE_TITLE]: getters.validTitle,
    [POST_ACTION_UPLOAD]: getters.uploadPost
  },
  mutations: {
    [POST_RESET_STATE]: state => {
      Object.assign(state, initialState());
    },
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
    [POST_FIELD_PERMALINK]: mutations.permalink,
    [POST_FIELD_TEMPLATE]: mutations.template,
    [POST_FIELD_TAGS]: mutations.tags,
    [POST_FIELD_BODY]: mutations.body,
    [POST_FIELD_STATUS]: mutations.status,
    [POST_SET_POSTS]: mutations.post,
    [POST_VALIDATE_TITLE]: mutations.validateTitle,
    [POST_ACTION_UPLOAD]: mutations.uploadPost
  },
  actions: {
    [POST_ACTION_UPLOAD]: actions.uploadPost,
    [POST_ACTION_DELETE]: actions.deletePost
  }
};
