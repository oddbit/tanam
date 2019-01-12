import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { ContentTypeEditComponent } from './content-type-edit/content-type-edit.component';
import { ContentTypeOverviewComponent } from './content-type-overview/content-type-overview.component';
import { ContentEntryEditComponent } from './content-entry-edit/content-entry-edit.component';
import { ContentTypeListComponent } from './content-type-list/content-type-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'settings', component: SettingsComponent },

      { path: 'content/types', component: ContentTypeListComponent },
      { path: 'content/type/:typeId', component: ContentTypeOverviewComponent },
      { path: 'content/type/:typeId/edit', component: ContentTypeEditComponent },

      { path: 'content/entry/:typeId/:entryId', redirectTo: 'content/entry/:typeId/:entryId/edit', pathMatch: 'full' },
      { path: 'content/entry/:typeId/:entryId/edit', component: ContentEntryEditComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
