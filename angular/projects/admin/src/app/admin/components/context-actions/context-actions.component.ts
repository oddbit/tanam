import { CdkPortal, DomPortalHost } from '@angular/cdk/portal';
import { AfterViewInit, ApplicationRef, Component, ComponentFactoryResolver, Injector, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'tanam-context-actions',
  templateUrl: './context-actions.component.html',
  styleUrls: ['./context-actions.component.scss']
})
export class ContextActionsComponent implements AfterViewInit, OnDestroy {
  @ViewChild(CdkPortal, { static: false })
  private portal: CdkPortal;
  private host: DomPortalHost;

  constructor(
    private componentFactoryReslover: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private injector: Injector
  ) { }

  ngAfterViewInit(): void {
    this.host = new DomPortalHost(
      document.querySelector('#context-actions'),
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
