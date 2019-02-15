import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, ChildActivationStart, ChildActivationEnd } from '@angular/router';
import { filter, distinctUntilChanged, map, pluck } from 'rxjs/operators';
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
    this._subscriptions.push(this.activatedRoute.url.subscribe(_ => this.buildBreadcrumbs()));
  }

  ngOnDestroy() {
    this._subscriptions.filter(s => !!s && !s.closed).forEach(s => s.unsubscribe);
  }

  private buildBreadcrumbs() {
    this.breadcrumbs.splice(0, this.breadcrumbs.length);
    // const route = this.activatedRoute.children[0];
    // if (route.routeConfig.data && route.routeConfig.data.breadcrumb) {
    //   this.breadcrumbs.push({
    //     title: route.routeConfig.data.breadcrumb,
    //     url: '',
    //   } as Breadcrumb);
    // }
  }
}
