import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

interface Breadcrumb {
  title: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  readonly breadcrumbs: Breadcrumb[] = [];
  private readonly _subscriptions: Subscription[] = [];

  constructor(
    private readonly activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this._subscriptions.push(this.activatedRoute.url.subscribe(() => {
      this.breadcrumbs.splice(0, this.breadcrumbs.length);
      this.buildBreadcrumbs(this.activatedRoute, '/_/');
    }));
  }

  ngOnDestroy() {
    this._subscriptions.filter(s => !!s && !s.closed).forEach(s => s.unsubscribe);
  }

  private buildBreadcrumbs(activatedRoute: ActivatedRoute, currentRootUrl: string) {
    const currentUrl = [currentRootUrl, activatedRoute.routeConfig.path].join('/');
    if (activatedRoute.routeConfig.data && activatedRoute.routeConfig.data.breadcrumb) {
      this.breadcrumbs.push({
        title: activatedRoute.routeConfig.data.breadcrumb,
        url: currentUrl,
      } as Breadcrumb);
    }

    if (!!activatedRoute.firstChild) {
      this.buildBreadcrumbs(activatedRoute.firstChild, currentUrl);
    }
  }
}
