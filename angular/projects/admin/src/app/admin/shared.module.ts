
import { SubToolbarComponent } from './navigation/sub-toolbar/sub-toolbar.component';
import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';

@NgModule({
  entryComponents: [SubToolbarComponent],
  declarations: [
    SubToolbarComponent,
  ],
  imports: [
    PortalModule,
  ],
  exports: [SubToolbarComponent]
})
export class SharedModule { }
