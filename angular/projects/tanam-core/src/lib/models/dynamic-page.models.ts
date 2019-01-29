
/**
 * Document context is the object that is passed into the template and can be accessed via the `document` attribute.
 *
 * The `url` attribute is optional, since it is possible to have content that does not offer a URL to access them on.
 * Examples of that would be for example to create a dynamic pricing table on the website where
 * it will always be displayed as an embedded part of another page. Or for example "addresses" that should only be
 * placed in a list on the contact page. Both types might want to offer a rich set of information in the `data`
 * attribute, but neither of them need to have a page that you can access them individually.
 *
 * ## Example DocumentContext
 *
 * ```
 *  {
 *    id: '0mIr2MFnDRt6JPgAMncj',
 *    contentType: 'blog',
 *    title: 'My blog post',
 *    url: "/blog/2018/my-blog-post",
 *    status: "published",
 *    revision: 123,
 *    tags: ["fun", "profit"],
 *    created: new Date('2019-01-01T01:02:03'),
 *    updated: new Date('2019-01-02T04:05:06'),
 *    published: new Date('2019-01-03T07:08:09'),
 *    data: {
 *      headline: "My blog post",
 *      body: "Lorem ipsum...",
 *      feaaturedImage: "/content/images/my-featured-image.jpg",
 *      somethingElse: "You can add what ever fields you want",
 *      forReal: true,
 *      whenWasThat: <Date>
 *    },
 *  }
 * ```
 */
export interface DocumentContext {
  id: string;
  contentType: string;
  data: { [key: string]: any };
  title: string;
  url?: string;
  revision: number;
  status: string;
  tags: string[];
  created: Date;
  updated: Date;
  published?: Date;
}
