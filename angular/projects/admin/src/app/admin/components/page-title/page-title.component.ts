import {
  Component,
  ApplicationRef,
  Injector,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ComponentFactoryResolver,
  Input,
  OnChanges
} from '@angular/core';
import { CdkPortal, DomPortalHost } from '@angular/cdk/portal';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'tanam-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss']
})
export class PageTitleComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() pageTitle: string;
  @Input() description: string;
  @Input() hide = false;

  @ViewChild(CdkPortal, { static: false })
  private portal: CdkPortal;
  private host: DomPortalHost;

  constructor(
    private readonly componentFactoryReslover: ComponentFactoryResolver,
    private readonly applicationRef: ApplicationRef,
    private readonly injector: Injector,
    private readonly title: Title,
  ) { }

  ngOnChanges(): void {
    this.title.setTitle(this.pageTitle);
  }

  ngAfterViewInit(): void {
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
