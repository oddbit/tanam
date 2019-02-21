import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DocumentEditComponent } from './document/document-edit/document-edit.component';
import { DocumentOverviewComponent } from './document/document-overview/document-overview.component';
import { ThemeTemplateEditComponent } from './theme-template/theme-template-edit/theme-template-edit.component';
import { ThemeTemplateOverviewComponent } from './theme-template/theme-template-overview/theme-template-overview.component';
import { DocumentTypeEditComponent } from './document-type/document-type-edit/document-type-edit.component';
import { DocumentTypeOverviewComponent } from './document-type/document-type-overview/document-type-overview.component';
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
            component: DocumentTypeOverviewComponent,
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
                    component: DocumentOverviewComponent,
                    canActivate: [PublisherGuard],
                  },
                  {
                    path: 'edit',
                    component: DocumentTypeEditComponent,
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
                  { path: 'edit', component: DocumentEditComponent, canActivate: [PublisherGuard] }
                ],
              },
            ],
          },
          {
            path: 'themes',
            canActivate: [AdminGuard],
            component: ThemeOverviewComponent,
          },
          {
            path: 'theme',
            canActivate: [AdminGuard],
            children: [
              {
                path: ':themeId',
                children: [
                  {
                    path: '',
                    component: ThemeTemplateOverviewComponent,
                  },
                  {
                    path: 'templates',
                    children: [
                      { path: '', component: NotFoundComponent },
                      { path: ':templateId', component: ThemeTemplateEditComponent },
                      { path: ':templateId/edit', component: ThemeTemplateEditComponent },
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
