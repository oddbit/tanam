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
  createLink: '/events/post',
  createName: 'event-posts',
  firestore: 'event-posts',
  storageName: 'events',
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
  createLink: '/blogs/post',
  createName: 'blog-posts',
  firestore: 'blog-posts',
  storageName: 'blogs',
  fields: state => {
    const fieldsArr = [
      'title',
      'body',
      'featuredImage',
      'status',
      ...autoFields
    ];
    return filterFields(state, fieldsArr);
  }
};
