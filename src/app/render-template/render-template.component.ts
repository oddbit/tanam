import { Component, OnInit, ViewChild, ViewContainerRef, Compiler, AfterViewInit, NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentEntryService } from '../services/content-entry.service';
import { ActivatedRoute } from '@angular/router';
import { ContentTypeService } from '../services/content-type.service';
import { TemplateService } from '../services/template.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-render-template',
  templateUrl: './render-template.component.html',
  styleUrls: ['./render-template.component.scss']
})
export class RenderTemplateComponent implements OnInit, AfterViewInit {
  readonly rootPath = this.route.snapshot.paramMap.get('typePrefix') || '';
  readonly entryPath = this.route.snapshot.paramMap.get('entryPath') || this.route.snapshot.url.join('/');
  documentFound = null;

  @ViewChild('viewContainer', { read: ViewContainerRef }) viewContainer: ViewContainerRef;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly compiler: Compiler,
    private readonly cts: ContentTypeService,
    private readonly ces: ContentEntryService,
    private readonly ts: TemplateService,
  ) { }

  ngOnInit() {
    console.log(`[RenderTemplateComponent:renderTemplate] prefix: '${this.rootPath}'`);
    console.log(`[RenderTemplateComponent:renderTemplate] path: '${this.entryPath}'`);
  }

  ngAfterViewInit() {
    this.renderTemplate();
  }

  private async renderTemplate() {
    const contentEntry = await this.ces.findContentEntryByUrl(this.rootPath, this.entryPath).pipe(take(1)).toPromise();
    this.documentFound = !!contentEntry;
    if (!this.documentFound) {
      console.log(`[RenderTemplateComponent:renderTemplate] No entry for: ${[this.rootPath, this.entryPath].join('/')}`);
      return;
    }

    const contentType = await this.cts.getContentType(contentEntry.contentType).pipe(take(1)).toPromise();
    const dynamicTemplate = await this.ts.getTemplate(contentType.template).pipe(take(1)).toPromise();

    const dynamicComponent = Component({ template: dynamicTemplate.html })(class { });
    const dynamicModule = NgModule({
      imports: [CommonModule],
      declarations: [dynamicComponent]
    })(class { });

    this.compiler.compileModuleAndAllComponentsAsync(dynamicModule)
      .then((factories) => {
        const factory = factories.componentFactories[0];
        const componentRef = this.viewContainer.createComponent(factory);
        componentRef.instance.page = {
          context: {
            headline: 'Awesome!',
            content: 'Truly',
          }
        };
      });
  }
}
