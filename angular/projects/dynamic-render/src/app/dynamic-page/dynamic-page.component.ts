import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, take, tap } from 'rxjs/operators';
import { ContentEntryService, SiteThemeService, TanamTheme } from 'tanam-core';
import { DynamicPageService } from '../services/dynamic-page.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dynamic-page',
  templateUrl: './dynamic-page.component.html',
  styles: []
})
export class DynamicPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];
  readonly rootPath = this.route.snapshot.paramMap.get('typePrefix') || '';
  readonly entryPath = this.route.snapshot.paramMap.get('entryPath') || this.route.snapshot.url.join('/');
  documentFound = null;

  @ViewChild('viewContainer', { read: ViewContainerRef }) viewContainer: ViewContainerRef;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly contentEntryService: ContentEntryService,
    private readonly dynamicPage: DynamicPageService,
    private readonly siteThemeservice: SiteThemeService,

  ) { }

  ngOnInit() {
    console.log(`[DynamicPageComponent:ngOnInit] prefix: '${this.rootPath}'`);
    console.log(`[DynamicPageComponent:ngOnInit] path: '${this.entryPath}'`);
    this.subscriptions.push(this.siteThemeservice.getCurrentTheme().subscribe(theme => {
      for (const script of theme.scripts) {
        this.dynamicPage.addScriptToBody(script);
      }
      for (const style of theme.styles) {
        this.dynamicPage.addStyle(style);
      }
    }));
  }

  ngAfterViewInit() {
    this.renderContent();
  }

  ngOnDestroy() {
    this.subscriptions.filter(s => !!s && !s.closed).forEach(s => s.unsubscribe());
  }

  private async renderContent() {
    const contentEntry = await this.contentEntryService.findByUrl(this.rootPath, this.entryPath).pipe(take(1)).toPromise();
    this.documentFound = !!contentEntry;
    if (this.documentFound) {
      this.dynamicPage.render(this.viewContainer, contentEntry);
    }
  }
}
