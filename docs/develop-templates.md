# About
Templates are written in Angular template language.

## Document context
Each template will have a locally scoped document context that contains information
about the site and the currently rendered document.

```json
{
  "id": "2pLAoWMSUZPMj72rST0t",
  "documentType": "event",
  "data": {
    "address": "Kembali Innovation Hub,Jl. Sunset Road No.28, Seminyak, Kuta, Kabupaten Badung, Bali 80361",
    "body": "<p>Full HTML supported content</p>",
    "startDate": "2019-01-31T04:00:00.000Z",
    "endDate": "2019-01-31T06:00:00.000Z",
    "image": "/content/images/women-will-2019.jpg",
    "registerLink": "bit.ly/AIForBusiness",
    "title": "Women Will"
  },
  "title": "Women Will",
  "url": "/event/women-will",
  "hostDomain": "tanam-e8e7d.firebaseapp.com",
  "hostUrl": "https://tanam-e8e7d.firebaseapp.com",
  "permalink": "https://tanam-e8e7d.firebaseapp.com/event/women-will",
  "revision": 0,
  "status": "published",
  "tags": [
    "event",
    "entrepreneurship",
    "gbg"
  ],
  "created": "2019-01-23T16:00:00.000Z",
  "updated": "2019-01-31T16:00:00.000Z",
  "published": "2019-01-31T16:00:00.000Z"
}
```

The `data` field consist of custom user data, as defined by the content type. While all the other
fields are consistent and present for all documen types.

### Standalone document types
If a document type is "standalone" it means that it has a public URL for which the document can
be accessed and rendered. This is for example pages, blog posts etc. But you can also declare
document types such as "venue" or something that you might not want to create a standalone
webpage for. The document types can still be used in the same way as any other document type,
it will just not have any public URL and the attributes `url` and `permalink` will be set to
`null` in the document context object.


## Directives
Tanam supports two custom directives for accessing other published content on the site.

### Document
You can fetch a single document by its ID like the example below, and access the document's context within the template.

 - `context` mandatory to be **exactly** like this. The document context is used to build a dependecy graph for the cache of pre-rendered content.
 - `documentId` mandatory ID of the document

```html
<ng-template tanamDocument
             [context]="context"
             documentId="blog"
             let-blogPost>
    <a href="{{ blogPost.url }}">{{ blogPost.title }}</a>
</ng-template>
```


### Documents query
You can fetch a number of documents through simple query

 - `context` mandatory to be **exactly** like the example below. The document context is used to build a dependecy graph for the cache of pre-rendered content.
 - `type` a mandatory identifier that corresponds to the document type in the database.
 - `limit` optional limit of number of documents to get (defaults to 10)
 - `orderBy` optional field to order the results by (defaults to `published` which is the date when the document was published)
 - `sortOrder` optional sort order. The values can be `"asc"` or `"desc"` (defaults to `"desc"`)

```html
<ng-template tanamDocuments
             [context]="context"
             type="blog"
             limit=10
             orderBy="title"
             let-posts>
  <ul>
    <li *ngFor="let blogPost of posts | async">
      <a href="{{ blogPost.url }}">
        {{ blogPost.title }}
      </a>
    </li>
  </ul>
</ng-template>
```

## Document types and their templates
Each document type (blog, event, page, etc) must have a default template with the same ID has itself. For example,
if the blog document type has this path:

```
/tanam/my-awesome-tanam-site/document-types/blog
```

Then there must be a default template for each theme with the ID `blog`.

```
/tanam/my-awesome-tanam-site/themes/my-custom-theme-1/templates/blog
/tanam/my-awesome-tanam-site/themes/my-custom-theme-2/templates/blog
```

Apart from the default template, the document types can have any number of custom templates that it can be used in. This can for example be grid cards or list element that are utilized by implementing
list iteration with the [documents query directive that was mentioned above](#documents-query).

```
/tanam/my-awesome-tanam-site/themes/my-custom-theme-1/templates/blog-grid-card
/tanam/my-awesome-tanam-site/themes/my-custom-theme-2/templates/blog-list-element
```

### Example of using custom template with document query directive

```html
<ng-template tanamDocuments
             [context]="context"
             type="blog"
             limit=3
             orderBy="title"
             let-posts>
    <div *ngFor="let blogPost of posts | async">
        <my-blog-grid-card [context]="blogPost"></my-blog-grid-card>
    </div>
</ng-template>
```
