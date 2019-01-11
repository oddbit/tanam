import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { ContentTypeDetailsComponent } from './content-type-details/content-type-details.component';
import { ContentTypeOverviewComponent } from './content-type-overview/content-type-overview.component';

const routes: Routes = [
  { path: '', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'admin', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'admin/dashboard', component: DashboardComponent },
  { path: 'admin/settings', component: SettingsComponent },
  { path: 'admin/content/:type', component: ContentTypeOverviewComponent },
  { path: 'admin/content/:type/details', component: ContentTypeDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
