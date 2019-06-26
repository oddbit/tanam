import { NgModule } from '@angular/core';
import { UserOverviewComponent } from './user-overview/user-overview.component';
import { AppMaterialModule } from '../../app-material.module';

@NgModule({
  declarations: [
    UserOverviewComponent
  ],
  imports: [
    AppMaterialModule
  ],
  exports: [UserOverviewComponent]
})
export class UserModule { }
