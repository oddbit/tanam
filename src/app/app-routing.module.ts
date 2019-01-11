import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { ContentTypeEditComponent } from './content-type-edit/content-type-edit.component';
import { ContentTypeOverviewComponent } from './content-type-overview/content-type-overview.component';
import { ContentEntryEditComponent } from './content-entry-edit/content-entry-edit.component';
import { ContentTypeListComponent } from './content-type-list/content-type-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'admin', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'admin/dashboard', component: DashboardComponent },
  { path: 'admin/settings', component: SettingsComponent },

  { path: 'admin/content/types', component: ContentTypeListComponent },
  { path: 'admin/content/type/:typeId', component: ContentTypeOverviewComponent },
  { path: 'admin/content/type/:typeId/edit', component: ContentTypeEditComponent },

  { path: 'admin/content/entry/:typeId/:entryId', redirectTo: 'admin/content/entry/:typeId/:entryId/edit', pathMatch: 'full' },
  { path: 'admin/content/entry/:typeId/:entryId/edit', component: ContentEntryEditComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
