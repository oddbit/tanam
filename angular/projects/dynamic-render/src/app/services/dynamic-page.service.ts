import { CommonModule } from '@angular/common';
import { Compiler, Component, ComponentRef, Inject, Injectable, NgModule, Renderer2, ViewContainerRef } from '@angular/core';
import { DOCUMENT, Title } from '@angular/platform-browser';
import { take } from 'rxjs/operators';
import { ContentEntry, ContentTemplate, ContentType } from 'tanam-core';
import { ContentTemplateService, ContentTypeService, SiteSettingsService } from 'tanam-core';
import { TanamDocumentContext } from '../models/dynamic-page.models';

@Injectable({
  providedIn: 'root'
})
export class DynamicPageService {

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly compiler: Compiler,
    private readonly titleService: Title,
    private readonly contentTypeService: ContentTypeService,
    private readonly contentTemplateService: ContentTemplateService,
    private readonly siteSettingsService: SiteSettingsService,
  ) { }


  addStyle(style: string) {
    if (style.startsWith('/theme') || style.startsWith('http')) {
      const element = this.document.createElement('link');
      element.rel = 'stylesheet';
      element.href = style;
      this.document.head.appendChild(element);
    } else {
      const element = this.document.createElement('style');
      element.innerText = style;
      this.document.head.appendChild(element);
    }
  }

  addScriptToBody(script: string) {
    script = script.trim();
    const element = this.document.createElement('script');
    element.type = `text/javascript`;
    if (script.startsWith('/theme') || script.startsWith('http')) {
      element.src = script;
    } else {
      element.innerText = script;
    }
    this.document.body.appendChild(element);
  }

  addJsonLd(json: any) {
    const element = this.document.createElement('script');
    element.type = `application/ld+json`;
    element.text = JSON.stringify(json);
    this.document.body.appendChild(element);
  }

  async setTitle(title: string) {
    const siteName = await this.siteSettingsService.getSiteName().pipe(take(1)).toPromise();
    this.titleService.setTitle(`${title} | ${siteName}`);
  }

  async render(viewContainer: ViewContainerRef, contentEntry: ContentEntry): Promise<ComponentRef<any>> {
    const contentType = await this.contentTypeService.getContentType(contentEntry.contentType).pipe(take(1)).toPromise();
    if (!contentType) {
      throw new Error(`Template misconfiguration. No such template for '${contentEntry.contentType}'`);
    }

    const template = await this.contentTemplateService.getTemplate(contentType.template).pipe(take(1)).toPromise();
    const documentContextData = this.generateDocumentContext(contentType, contentEntry);
    const module = await this.createModule(documentContextData);
    const factories = await this.compiler.compileModuleAndAllComponentsAsync(module);
    const factory = factories.componentFactories.filter(cf => cf.selector === template.selector)[0];
    if (!factory) {
      throw new Error(`Could not find any template for <${template.selector}>`);
    }

    this.setTitle(contentEntry.title);
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
    } as TanamDocumentContext;
  }

  private async createModule(documentContext: TanamDocumentContext) {
    const themeId = await this.siteSettingsService.getSiteTheme().pipe(take(1)).toPromise();
    const templates = await this.contentTemplateService.getTemplatesForTheme(themeId).pipe(take(1)).toPromise();
    if (templates.length === 0) {
      throw new Error(`No templates defined in theme: ${themeId}`);
    }

    return NgModule({
      imports: [CommonModule],
      declarations: templates.map(c => this.createComponent(c, documentContext)),
    })(class { });
  }

  private createComponent(template: ContentTemplate, documentContext: TanamDocumentContext) {
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
