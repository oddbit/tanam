import { CommonModule, DOCUMENT } from '@angular/common';
import { Compiler, Component, Inject, Injectable, NgModule, ViewContainerRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { take } from 'rxjs/operators';
import { DocumentTemplate, TanamDocumentContext } from 'tanam-models';
import { DynamicTemplateModule } from '../dynamic-template/dynamic-template.module';
import { SiteService } from './site.service';
import { TemplateService } from './template.service';

@Injectable({
  providedIn: 'root'
})
export class DynamicPageService {


  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly compiler: Compiler,
    private readonly titleService: Title,
    private readonly templateService: TemplateService,
    private readonly siteService: SiteService,
  ) { }


  addStyle(style: string) {
    if (style.startsWith('/theme') || style.startsWith('http')) {
      const element = this.document.createElement('link');
      element.rel = 'preload';
      element.href = style;
      element.as = 'style';
      element.setAttribute('onload', 'this.onload=null;this.rel="stylesheet"');
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
    const siteName = await this.siteService.getSiteName().pipe(take(1)).toPromise();
    this.titleService.setTitle(`${title} | ${siteName}`);
  }

  async render(viewContainer: ViewContainerRef, documentContext: TanamDocumentContext) {
    const template = await this.templateService.getTemplate(documentContext).pipe(take(1)).toPromise();
    if (!template) {
      throw new Error(`Document type '${documentContext.documentType}' have a non-existing template: ${template}`);
    }

    const module = await this.createModule();
    const factories = this.compiler.compileModuleAndAllComponentsSync(module);
    const factory = factories.componentFactories.filter(cf => cf.selector === template.selector)[0];
    if (!factory) {
      throw new Error(`Could not find any component with selector <${template.selector}>`);
    }

    const componentRef = viewContainer.createComponent(factory);
    componentRef.instance.context = documentContext;
  }

  private async createModule() {
    const templates = await this.templateService.getTemplates().pipe(take(1)).toPromise();
    if (templates.length === 0) {
      throw new Error(`No templates defined in current theme!`);
    }

    return NgModule({
      imports: [
        CommonModule,
        DynamicTemplateModule,
      ],
      declarations: templates.map(c => this.createComponent(c)),
    })(class { });
  }

  private createComponent(template: DocumentTemplate) {
    return Component({
      selector: template.selector,
      template: template.template,
      styles: template.styles,
      inputs: ['context'],
    })(class {
      context: TanamDocumentContext;
    });
  }
}
