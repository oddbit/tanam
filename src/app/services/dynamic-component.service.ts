import { CommonModule } from '@angular/common';
import { Compiler, Component, ComponentRef, Injectable, NgModule, ViewContainerRef } from '@angular/core';
import * as firebase from 'firebase/app';
import { take } from 'rxjs/operators';
import { ContentEntry } from './content-entry.service';
import { ContentTemplate, ContentTemplateService } from './content-template.service';
import { ContentType, ContentTypeService } from './content-type.service';
import { DocumentHeaderService } from './document-header.service';

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
@Injectable({
  providedIn: 'root'
})
export class DynamicComponentService {
  constructor(
    private readonly compiler: Compiler,
    private readonly cts: ContentTypeService,
    private readonly dhs: DocumentHeaderService,
    private readonly contentTemplateService: ContentTemplateService,
  ) { }

  async render(viewContainer: ViewContainerRef, contentEntry: ContentEntry): Promise<ComponentRef<any>> {
    const contentType = await this.cts.getContentType(contentEntry.contentType).pipe(take(1)).toPromise();
    if (!contentType) {
      throw new Error(`Template misconfiguration. No such template for '${contentEntry.contentType}'`);
    }

    const template = await this.contentTemplateService.getTemplate(contentType.template).pipe(take(1)).toPromise();
    const documentContextData = this.generateDocumentContext(contentType, contentEntry);
    const module = await this.createModule(documentContextData);
    const factories = await this.compiler.compileModuleAndAllComponentsAsync(module);
    const factory = factories.componentFactories.filter(cf => cf.selector === template.selector)[0];

    this.dhs.setTitle(contentEntry.title);
    return viewContainer.createComponent(factory);
  }

  private generateDocumentContext(contentType: ContentType, contentEntry: ContentEntry) {
    return {
      id: contentEntry.id,
      contentType: contentEntry.contentType,
      data: contentEntry.data,
      title: contentEntry.title,
      url: contentType.standalone
        ? [contentEntry.url.root, contentEntry.url.path].join('/')
        : null,
      revision: contentEntry.revision,
      status: contentEntry.status,
      tags: contentEntry.tags,
      created: (contentEntry.createdAt as firebase.firestore.Timestamp).toDate(),
      updated: (contentEntry.updatedAt as firebase.firestore.Timestamp).toDate(),
      published: !!contentEntry.publishTime
        ? (contentEntry.publishTime as firebase.firestore.Timestamp).toDate()
        : null,
    } as DocumentContext;
  }

  private async createModule(documentContext: DocumentContext) {
    const components = await this.contentTemplateService.getTemplates('').pipe(take(1)).toPromise();
    return NgModule({
      imports: [CommonModule],
      declarations: components.map(c => this.createComponent(c, documentContext)),
    })(class { });
  }

  private createComponent(template: ContentTemplate, documentContext: DocumentContext) {
    const dynamicClass = class {
      document = documentContext;
    };

    return Component({
      selector: template.selector,
      template: template.template,
      styles: template.styles,
    })(dynamicClass);
  }
}
