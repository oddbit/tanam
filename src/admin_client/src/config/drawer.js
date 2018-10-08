export const mainDrawerList = [
  {
    key: 'dashboard',
    permalink: '/',
    name: 'Dashboard',
    icon: 'dashboard'
  },
  {
    key: 'contentTypeList',
    subheader: 'CONTENT TYPE',
    permalink: '/content-type'
  },
  {
    key: 'manage',
    subheader: 'MANAGE',
    permalink: '/manage',
    lists: [
      {
        key: 'contentType',
        name: 'Content Type',
        permalink: '/content-type',
        icon: 'insert_drive_file'
      },
      {
        key: 'pages',
        name: 'Pages',
        permalink: '/pages',
        icon: 'pages'
      },
      {
        key: 'images',
        name: 'Images',
        permalink: '/images',
        icon: 'photo'
      }
    ]
  },
  {
    key: 'configure',
    subheader: 'CONFIGURE',
    permalink: '/configure',
    lists: [
      {
        key: 'theme',
        name: 'Theme',
        permalink: '/theme',
        icon: 'bubble_chart'
      }
    ]
  }
];
