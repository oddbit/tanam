import {
  CONTENTTYPE_POST
} from '../types';
import getters from './getters';
import actions from './actions';

const state = {
  contentTypePost: {
    event: [
      {
        data:{
          body: 'Lorem ipsum',
          ContentTitle: 'This published is ContentTitle'
        },
        time: '2018-09-12 11:32 AM',
        status: 'published'
      },
      {
        data: {
          body: 'Lorem ipsum',
          ContentTitle: 'This is ContentTitle'
        },
        time: '2018-09-12 11:32 AM',
        status: 'unpublished'
      }
    ],
    news: [
      {
        data: {
          body: 'Lorem ipsum',
          ContentTitle: 'This is published ContentTitle'
        },
        time: '2018-09-12 11:32 AM',
        status: 'published'
      },
      {
        data: {
          body: 'Lorem ipsum',
          ContentTitle: 'This is ContentTitle'
        },
        time: '2018-09-12 11:32 AM',
        status: 'unpublished'
      }
    ]
  } 
};

export default {
  state,
  getters: {
    [CONTENTTYPE_POST]: getters.getPosts
  },
  actions: {
    // [POST_BY]: actions.getPostBy,
    [CONTENTTYPE_POST]: actions.getPublishedPosts
    // [POST_DRAFT]: actions.getDraftPosts
  }
};
