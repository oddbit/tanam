import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { ContentTypeDetailsComponent } from './content-type-details/content-type-details.component';
import { ContentTypeOverviewComponent } from './content-type-overview/content-type-overview.component';
import { ContentTypeEntryEditComponent } from './content-type-entry-edit/content-type-entry-edit.component';

const routes: Routes = [
  { path: '', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'admin', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'admin/dashboard', component: DashboardComponent },
  { path: 'admin/settings', component: SettingsComponent },
  { path: 'admin/content/:typeId', component: ContentTypeOverviewComponent },
  { path: 'admin/content/:typeId/details', component: ContentTypeDetailsComponent },
  { path: 'admin/content/:typeId/edit/:entryId', component: ContentTypeEntryEditComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
