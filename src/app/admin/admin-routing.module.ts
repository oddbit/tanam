import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from './admin-auth.guard';
import { AdminComponent } from './admin.component';
import { AdminGuard } from './admin.guard';
import { ContentEntryEditComponent } from './content-entry-edit/content-entry-edit.component';
import { ContentEntryOverviewComponent } from './content-entry-overview/content-entry-overview.component';
import { ContentTemplateEditComponent } from './content-template-edit/content-template-edit.component';
import { ContentTemplateListComponent } from './content-template-list/content-template-list.component';
import { ContentTypeEditComponent } from './content-type-edit/content-type-edit.component';
import { ContentTypeListComponent } from './content-type-list/content-type-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './login/login.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { SettingsComponent } from './settings/settings.component';
import { PublisherGuard } from './publisher.guard';

const routes: Routes = [
  {
    path: '_',
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AdminAuthGuard],
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: DashboardComponent },
          {
            path: 'settings',
            component: SettingsComponent,
            canActivate: [AdminGuard]
          },
          {
            path: 'content/types',
            component: ContentTypeListComponent,
            canActivate: [AdminGuard]
          },
          { path: 'content/type/:typeId', redirectTo: 'edit', pathMatch: 'full' },
          {
            path: 'content/type/:typeId/edit',
            component: ContentTypeEditComponent,
            canActivate: [AdminGuard]
          },
          {
            path: 'content/type/:typeId/entries',
            component: ContentEntryOverviewComponent,
            canActivate: [PublisherGuard]
          },
          { path: 'content/type/:typeId/entry/:entryId', redirectTo: 'edit', pathMatch: 'full' },
          {
            path: 'content/type/:typeId/entry/:entryId/edit',
            component: ContentEntryEditComponent,
            canActivate: [PublisherGuard]
          },

          {
            path: 'content/templates',
            component: ContentTemplateListComponent,
            canActivate: [AdminGuard]
          },
          { path: 'content/template/:templateId', redirectTo: 'edit', pathMatch: 'full' },
          {
            path: 'content/template/:templateId/edit',
            component: ContentTemplateEditComponent,
            canActivate: [AdminGuard]
          },
          { path: '**', component: NotFoundComponent },
        ],
      },
      { path: '**', redirectTo: 'login', pathMatch: 'full' },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
