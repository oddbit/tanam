import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { ContentEntryService } from '../../services/content-entry.service';
import { DynamicComponentService } from '../../services/dynamic-component.service';

@Component({
  selector: 'app-dynamic-page',
  templateUrl: './dynamic-page.component.html',
  styleUrls: ['./dynamic-page.component.scss']
})
export class DynamicPageComponent implements OnInit, AfterViewInit {
  readonly rootPath = this.route.snapshot.paramMap.get('typePrefix') || '';
  readonly entryPath = this.route.snapshot.paramMap.get('entryPath') || this.route.snapshot.url.join('/');
  documentFound = null;

  @ViewChild('viewContainer', { read: ViewContainerRef }) viewContainer: ViewContainerRef;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly ces: ContentEntryService,
    private readonly dcs: DynamicComponentService,
  ) { }

  ngOnInit() {
    console.log(`[DynamicPageComponent:ngOnInit] prefix: '${this.rootPath}'`);
    console.log(`[DynamicPageComponent:ngOnInit] path: '${this.entryPath}'`);
  }

  ngAfterViewInit() {
    this.renderContent();
  }

  private async renderContent() {
    const contentEntry = await this.ces.findByUrl(this.rootPath, this.entryPath).pipe(take(1)).toPromise();
    this.documentFound = !!contentEntry;
    if (this.documentFound) {
      this.dcs.render(this.viewContainer, contentEntry);
    }
  }
}
