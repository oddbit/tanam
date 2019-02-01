# About
Templates are written in Angular template language.

## Directives
Tanam supports two custom directives for accessing other published content on the site.

### Document
You can fetch a single document by its ID like the example below, and access the document's context within the template.

 - `context` mandatory to be **exactly** like this. The document context is used to build a dependecy graph for the cache of pre-rendered content.
 - `documentId` mandatory ID of the document

```html
<ng-template tanamDocument
             [context]="document"
             documentId="blog"
             let-blogPost>
    <a href="{{ blogPost.url }}">{{ blogPost.title }}</a>
</ng-template>
```


### Documents
You can fetch a number of documents through simple query

 - `context` mandatory to be **exactly** like the example below. The document context is used to build a dependecy graph for the cache of pre-rendered content.
 - `type` a mandatory identifier that corresponds to the document type in the database.
 - `limit` optional limit of number of documents to get (defaults to 10)
 - `orderBy` optional field to order the results by (defaults to `published` which is the date when the document was published)
 - `sortOrder` optional sort order. The values can be `"asc"` or `"desc"` (defaults to `"desc"`)

```html
<ng-template tanamDocuments
             [context]="document"
             type="blog"
             limit=10
             orderBy="title"
             let-posts>
    <ul>
        <li *ngFor="let blogPost of posts | async"><a href="{{ blogPost.url }}">{{ blogPost.title }}</a></li>
    </ul>
</ng-template>
```
