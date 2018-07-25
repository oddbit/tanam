import filterFields from '@/utils/filterFields';

const autoFields = [
  'createdAt',
  'publishedAt',
  'updatedAt',
  'deletedAt',
  'permalink'
];

export const event = {
  contentType: 'event',
  indexLink: '/events',
  indexName: 'events',
  createEventLink: '/events/post',
  createEventName: 'event-posts',
  firestore: 'event-posts',
  fields: state => {
    const fieldsArr = [
      'title',
      'body',
      'place',
      'datetimeStart',
      'datetimeEnd',
      'priceRegular',
      'priceMember',
      'rsvpEmail',
      'rsvpUrl',
      'rsvpFacebook',
      'featuredImage',
      'status',
      ...autoFields
    ];
    return filterFields(state, fieldsArr);
  }
};

export const blog = {
  contentType: 'blog',
  indexLink: '/blogs',
  indexName: 'blogs',
  createEventLink: '/blogs/post',
  createEventName: 'blog-posts',
  firestore: 'blog-posts',
  fields: [...autoFields, 'title', 'body', 'featuredImage']
};
