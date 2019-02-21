import { Component, ApplicationRef, Injector, OnDestroy, AfterViewInit, ViewChild, ComponentFactoryResolver, Input } from '@angular/core';
import { CdkPortal, DomPortalHost } from '@angular/cdk/portal';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss']
})
export class PageTitleComponent implements AfterViewInit, OnDestroy {

  @Input()
  pageTitle: string;

  @ViewChild(CdkPortal)
  private portal: CdkPortal;
  private host: DomPortalHost;

  constructor(
    private readonly componentFactoryReslover: ComponentFactoryResolver,
    private readonly applicationRef: ApplicationRef,
    private readonly injector: Injector,
    private readonly title: Title,
  ) { }

  ngAfterViewInit(): void {
    this.title.setTitle(this.pageTitle);

    this.host = new DomPortalHost(
      document.querySelector('#page-title'),
      this.componentFactoryReslover,
      this.applicationRef,
      this.injector
    );

    this.host.attach(this.portal);
  }

  ngOnDestroy(): void {
    this.host.detach();
  }
}
