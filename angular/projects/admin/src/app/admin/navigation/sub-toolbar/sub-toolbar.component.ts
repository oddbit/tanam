import { Component, ApplicationRef, Injector, OnDestroy, AfterViewInit, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { CdkPortal, DomPortalHost } from '@angular/cdk/portal';

@Component({
  selector: 'app-sub-toolbar',
  templateUrl: './sub-toolbar.component.html',
  styleUrls: ['./sub-toolbar.component.css']
})
export class SubToolbarComponent implements AfterViewInit, OnDestroy {

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
      document.querySelector('#sub-toolbar'),
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
