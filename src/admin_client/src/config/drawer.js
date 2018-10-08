export const mainDrawerList = [
  {
    name: 'dashboard',
    permalink: '/',
    title: 'Dashboard',
    icon: 'dashboard'
  },
  {
    name: 'contentTypeList',
    subheader: 'CONTENT TYPE',
    permalink: '/content-type'
  },
  {
    name: 'manage',
    subheader: 'MANAGE',
    permalink: '/manage',
    lists: [
      {
        name: 'contentType',
        title: 'Content Type',
        permalink: '/content-type',
        icon: 'insert_drive_file'
      },
      {
        name: 'pages',
        title: 'Pages',
        permalink: '/pages',
        icon: 'pages'
      },
      {
        name: 'images',
        title: 'Images',
        permalink: '/images',
        icon: 'photo'
      }
    ]
  },
  {
    name: 'configure',
    subheader: 'CONFIGURE',
    permalink: '/configure',
    lists: [
      {
        name: 'theme',
        title: 'Theme',
        permalink: '/theme',
        icon: 'bubble_chart'
      }
    ]
  }
];
