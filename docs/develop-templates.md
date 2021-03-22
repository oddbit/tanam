# Develop Tanam HTML Templates
HTML templates are written using [DustJS](http://www.dustjs.com/) template language.
It is an old template language and engine that is not very actively maintained.
But it is currently the only existing engine of our knowledge that can render server
side templates with support for asynchronous template values and directives.


```html
{#document}
  {@gt key=revision value=10}
  <strong>Hey, this document has received a lot of love!</strong>
  {:else}
  <span>Keep it up, champ!</span>
  {/gt}
{/document}
```

## Why is the async so important?
Tanam is 100% backed by Firebase and all database operations are asynchronous and will
return as `Promise`. The template markup allows for arbitrary document lookups and queries
with the helper directives [@document](#document-helper) and [@documents](#documents-helper).


# Page context
Each template will have a locally scoped document context that contains information
about the site and the currently rendered document.

```json
{
  "document": {
    "id": "2pLAoWMSUZPMj72rST0t",
    "documentType": "event",
    "data": {
      "venue": "Z1DripWIhE4vJFSZNSzX",
      "body": "<p>Full HTML supported content</p>",
      "startDate": "2019-01-31T04:00:00.000Z",
      "endDate": "2019-01-31T06:00:00.000Z",
      "image": "LOhmisLtnesWTMRtNZxY",
      "registerLink": "bit.ly/AIForBusiness",
      "title": "Women Will"
    },
    "title": "Women Will",
    "url": "/event/women-will",
    "permalink": "https://kumpul.id/event/women-will",
    "revision": 6,
    "status": "published",
    "tags": [
      "event",
      "entrepreneurship",
      "gbg"
    ],
    "created": "2019-04-01T04:37:40.978Z",
    "updated": "2019-04-02T07:43:04.693Z",
    "published": "2019-04-03T05:23:41.331Z"
  },
  "site": {
    "domain": "kumpul.id",
    "url": "https://kumpul.id",
    "theme": "default",
    "title": "Kumpul Coworking Space"
  }
}
```

The `data` field consist of custom user data, as defined by the content type. While all the other
fields are consistent and present for all document types.

## Types
In the example above, `document.data.venue` is referring to another document that can be fetched
using the [@document](#document-helper) directive helper.

The values for `document.data.startDate`, `document.data.endDate`, `document.created`, `document.updated` and `document.published` are regular Javascript dates.

## Referring to images
Images are simply refeerred to by their file IDs as saved in the document data. From the example
above, we would refer to the image like this

```html
<img src="/_/image/{document.data.image}" />
```

Every image that is uploaded to Tanam gets converted and scaled into WebP images for opportunity
of improving performance. Omitting any parameter will always return the originally uploaded image.
The other supported formats are: *large*, *medium* and *small*. All three WebP converted images
are keeping the same aspect ratio and downscaled to bounding boxes around 1600px, 800px and 300px
respectively. Images will never be upscaled if the original image is smaller than any of those
ranges.

```html
<img src="/_/image/{document.data.image}?s=large" />
<img src="/_/image/{document.data.image}?s=medium" />
<img src="/_/image/{document.data.image}?s=small" />
```

## Embedding partial templates
You can embed other templates by simply specifying the name of the template (Firestore ID)

```html
{> place /}
```

This example is including the partial template `place`. And we can pass data to it through
the `document` parameter as shown below, where an `place` object is first fetched and then
passed into the template.

```html
{@document id=document.data.venue document=document}
    {> place document=document /}
{/document}
```

The inner scope of `@document` is having an inner context structure where its inner `document`
variable is referring to the `venue` object.

# Helper directives

## Debug Helper
You can always print out the current context if you get unsure about the data or if
you are having trouble with the template.

```html
<pre>
    {@debugDump /}
</pre>
```

## Document Helper
You can fetch a single document by its ID like the example below, and access the document's context within the template.

 - `document` it is mandatory to pass in the document context of the page that is embedding other document
  data within its template. The context reference is used to build a dependecy graph so that the page caches
  can be smartly managed.
 - `id` mandatory ID of the document

```html
<!-- This is the ID of a venue from the example above -->
{@document id="Z1DripWIhE4vJFSZNSzX" document=document}
  <h1>{title}</h1>
  {#document.data}
    <ul>
      <li>{address1}</li>
      <li>{address2}</li>
      <li>{city}</li>
      <li>{region}</li>
      <li>{postCode}</li>
      <li>{country}</li>
      <li><a href="{mapsUrl}">View on maps</a></li>
    </ul>
  {/document.data}
{/document}
```


## Documents Helper
You can fetch a number of documents through simple query

 - `document` it is mandatory to pass in the document context of the page that is embedding other document
  data within its template. The context reference is used to build a dependecy graph so that the page caches
  can be smartly managed.
 - `documentType` a mandatory identifier that corresponds to the document type in the database.
 - `limit` optional limit of number of documents to get (defaults to 10)
 - `orderBy` optional field to order the results by (defaults to `published` which is the date when the document was published)
 - `sortOrder` optional sort order. The values can be `"asc"` or `"desc"` (defaults to `"desc"`)

```html
{@documents documentType="event" document=document}
  {#.}
    <h1>{title}</h1>
    {#document.data}
      <ul>
          <li>{address1}</li>
          <li>{address2}</li>
          <li>{city}</li>
          <li>{region}</li>
          <li>{postCode}</li>
          <li>{country}</li>
          <li><a href="{mapsUrl}">View on maps</a></li>
      </ul>
    {/document.data}
  {/.}
{/documents}
```

### What's up with the curly-brackets-hash-dot-syntax?
The `@documents` helper is returning an array of documents, so the `{#.}` refers to the "current context"
and Dust will loop over it since it's an array. You can access the current index in the loop with the
`$idx` variable or access a document at its index in the array with `[$idx]` syntax.

# Document types and their templates
Each document type (blog, event, page, etc) must have a default template with the same ID has itself. For example, if the blog document type has this Firestore data path:

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
