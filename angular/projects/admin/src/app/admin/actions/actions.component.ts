import { Component, ApplicationRef, Injector, OnDestroy, AfterViewInit, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { CdkPortal, DomPortalHost } from '@angular/cdk/portal';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.css']
})
export class ActionsComponent implements AfterViewInit, OnDestroy  {

  @ViewChild(CdkPortal)
  private portal: CdkPortal;
  private host: DomPortalHost;

  constructor(
    private componentFactoryReslover: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private injector: Injector
  ) { }

  ngAfterViewInit(): void {
    this.host = new DomPortalHost(
      document.querySelector('#sub-toolbar-button'),
      this.componentFactoryReslover,
      this.applicationRef,
      this.injector
    );
    console.log(this.portal);
    this.host.attach(this.portal);
  }

  ngOnDestroy(): void {
    this.host.detach();
  }

}
