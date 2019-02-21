import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ContentEntryEditComponent } from './content-entry/content-entry-edit/content-entry-edit.component';
import { ContentEntryOverviewComponent } from './content-entry/content-entry-overview/content-entry-overview.component';
import { ContentTemplateEditComponent } from './content-template/content-template-edit/content-template-edit.component';
import { ContentTemplateOverviewComponent } from './content-template/content-template-overview/content-template-overview.component';
import { ContentTypeEditComponent } from './content-type/content-type-edit/content-type-edit.component';
import { ContentTypeOverviewComponent } from './content-type/content-type-overview/content-type-overview.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { PublisherGuard } from './guards/publisher.guard';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './login/login.guard';
import { MediaComponent } from './media/media.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SettingsComponent } from './settings/settings.component';
import { ThemeEditComponent } from './theme/theme-edit/theme-edit.component';
import { ThemeOverviewComponent } from './theme/theme-overview/theme-overview.component';

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
          {
            path: 'dashboard',
            component: DashboardComponent,
          },
          {
            path: 'settings',
            component: SettingsComponent,
            canActivate: [AdminGuard],
          },
          {
            path: 'media',
            component: MediaComponent,
            canActivate: [PublisherGuard],
          },
          {
            path: 'types',
            component: ContentTypeOverviewComponent,
            canActivate: [AdminGuard],
          },
          {
            path: 'type',
            children: [
              {
                path: ':typeId',
                children: [
                  {
                    path: '',
                    redirectTo: 'overview',
                    pathMatch: 'full',
                  },
                  {
                    path: 'overview',
                    component: ContentEntryOverviewComponent,
                    canActivate: [PublisherGuard],
                  },
                  {
                    path: 'edit',
                    component: ContentTypeEditComponent,
                    canActivate: [AdminGuard]
                  },
                ],
              },
            ],
          },
          {
            path: 'document',
            children: [
              {
                path: ':documentId',
                children: [
                  { path: '', redirectTo: 'edit', pathMatch: 'full' },
                  { path: 'edit', component: ContentEntryEditComponent, canActivate: [PublisherGuard] }
                ],
              },
            ],
          },
          {
            path: 'themes',
            canActivate: [AdminGuard],
            children: [
              {
                path: '',
                component: ThemeOverviewComponent,
              },
              {
                path: ':themeId',
                children: [
                  {
                    path: '',
                    component: ContentTemplateOverviewComponent,
                  },
                  {
                    path: 'templates',
                    children: [
                      { path: '', component: NotFoundComponent },
                      { path: ':templateId', component: ContentTemplateEditComponent },
                      { path: ':templateId/edit', component: ContentTemplateEditComponent },
                    ],
                  },
                  { path: 'edit', component: ThemeEditComponent }
                ],
              },
            ],
          },

          { path: '**', component: NotFoundComponent },
        ],
      },
      { path: '**', redirectTo: 'login', pathMatch: 'full' },
    ],
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ]
})
export class AdminRoutingModule { }
