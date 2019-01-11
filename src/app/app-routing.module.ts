import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';
import { ContentTypeComponent } from './content-type/content-type.component';
import { ContentTypeDetailsComponent } from './content-type-details/content-type-details.component';

const routes: Routes = [
  { path: '', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'admin', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'admin/settings', component: AdminSettingsComponent },
  { path: 'admin/content/:type', component: ContentTypeComponent },
  { path: 'admin/content/:type/details', component: ContentTypeDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
