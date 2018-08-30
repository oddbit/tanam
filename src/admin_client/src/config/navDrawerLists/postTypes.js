import { event, blog } from '@/config/post';

export const postTypes = [
  {
    title: 'Blogs',
    icon: 'library_books',
    link: blog.indexLink
  },
  {
    title: 'Events',
    icon: 'event',
    link: event.indexLink
  }
];
