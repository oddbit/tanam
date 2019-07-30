import {
  AfterViewInit,
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  Injector,
  OnDestroy,
  ViewChild,
  Input,
  OnInit
} from '@angular/core';
import { CdkPortal, DomPortalHost } from '@angular/cdk/portal';

@Component({
  selector: 'tanam-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements AfterViewInit, OnDestroy {
  @ViewChild(CdkPortal, { static: false })
  private portal: CdkPortal;
  private host: DomPortalHost;
  @Input() title: string;

  constructor(
    private componentFactoryReslover: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private injector: Injector
  ) { }

  ngAfterViewInit(): void {
    this.host = new DomPortalHost(
      document.querySelector('#breadcrumbs'),
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
