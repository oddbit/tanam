import { Component, OnInit, ViewChild, ViewContainerRef, Compiler, AfterViewInit, NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template-render',
  template: `<ng-container #viewContainer></ng-container>`,
})
export class TemplateRenderComponent implements OnInit, AfterViewInit {

  @ViewChild('viewContainer', { read: ViewContainerRef }) viewContainer: ViewContainerRef;
  interval: NodeJS.Timer;

  constructor(private compiler: Compiler) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const dynamicTemplate = `
    <h1>Proof of concept dynamic content ({{ superlative }})</h1>
    <div *ngIf="flag; else altContent">
      <p>Condition is met</p>
    </div>
    <ng-template #altContent>
      <p>Condition is not met</p>
    </ng-template>
    `;
    const dynamicComponent = Component({ template: dynamicTemplate })(class { });
    const dynamicModule = NgModule({
      imports: [CommonModule],
      declarations: [dynamicComponent]
    })(class { });

    this.compiler.compileModuleAndAllComponentsAsync(dynamicModule)
      .then((factories) => {
        const factory = factories.componentFactories[0];
        const componentRef = this.viewContainer.createComponent(factory);
        componentRef.instance.superlative = 'Awesome!';

        this.interval = setInterval(() => {
          componentRef.instance.flag = !componentRef.instance.flag;
        }, 1000);
      });
  }
}