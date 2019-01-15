import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { ContentTypeEditComponent } from './content-type-edit/content-type-edit.component';
import { ContentEntryEditComponent } from './content-entry-edit/content-entry-edit.component';
import { ContentTypeListComponent } from './content-type-list/content-type-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin.component';
import { ContentTemplateListComponent } from './content-template-list/content-template-list.component';
import { ContentTemplateFormComponent } from './content-template-form/content-template-form.component';
import { ContentEntryOverviewComponent } from './content-entry-overview/content-entry-overview.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'settings', component: SettingsComponent },

      { path: 'content/types', component: ContentTypeListComponent },
      { path: 'content/type/:typeId', redirectTo: 'edit', pathMatch: 'full' },
      { path: 'content/type/:typeId/edit', component: ContentTypeEditComponent },
      { path: 'content/type/:typeId/entries', component: ContentEntryOverviewComponent },
      { path: 'content/type/:typeId/entry/:entryId', redirectTo: 'edit', pathMatch: 'full' },
      { path: 'content/type/:typeId/entry/:entryId', component: ContentEntryEditComponent },

      { path: 'content/templates', component: ContentTemplateListComponent },
      { path: 'content/template/:templateId', redirectTo: 'edit', pathMatch: 'full' },
      { path: 'content/template/:templateId/edit', component: ContentTemplateFormComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
