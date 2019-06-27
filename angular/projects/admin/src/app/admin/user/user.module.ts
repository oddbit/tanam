import { NgModule } from '@angular/core';
import { UserOverviewComponent } from './user-overview/user-overview.component';
import { AppMaterialModule } from '../../app-material.module';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';

@NgModule({
  declarations: [
    UserOverviewComponent
  ],
  imports: [
    AppMaterialModule,
    VirtualScrollerModule
  ],
  exports: [UserOverviewComponent]
})
export class UserModule { }
