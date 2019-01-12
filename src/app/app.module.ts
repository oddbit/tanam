import { LayoutModule } from '@angular/cdk/layout';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { AngularFireModule, FirebaseOptionsToken } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { ContentTypeEditComponent } from './content-type-edit/content-type-edit.component';
import { AppConfigService } from './app-config.service';
import { ContentTypeOverviewComponent } from './content-type-overview/content-type-overview.component';
import { ContentEntryListComponent } from './content-entry-list/content-entry-list.component';
import { ContentEntryEditComponent } from './content-entry-edit/content-entry-edit.component';
import { SettingsDomainComponent } from './settings-domain/settings-domain.component';
import { SettingsSiteComponent } from './settings-site/settings-site.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { TemplateRenderComponent } from './template-render/template-render.component';
import {
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatSidenavModule,
  MatToolbarModule,
  MatCheckboxModule,
  MatChipsModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MatCardModule,
  MatTableModule,
  MatProgressSpinnerModule,
} from '@angular/material';
import { ContentTypeListComponent } from './content-type-list/content-type-list.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    DashboardComponent,
    NavigationComponent,
    SettingsComponent,
    SettingsDomainComponent,
    SettingsSiteComponent,
    ContentTypeOverviewComponent,
    ContentTypeEditComponent,
    ContentEntryListComponent,
    ContentEntryEditComponent,
    ContentTypeListComponent,
    TemplateRenderComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'tanam' }),
    AppRoutingModule,
    // AppFirebaseModule,
    BrowserTransferStateModule,
    HttpClientModule,
    LayoutModule,

    // Firebase
    AngularFireModule,
    AngularFirestoreModule,
    AngularFireStorageModule,

    // Material design modules
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatChipsModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    AppConfigService,
    {
      provide: APP_INITIALIZER, // Asynchrounously load client's App Configuration
      useFactory: (appConfig: AppConfigService) => () => appConfig.loadAppConfig(),
      multi: true,
      deps: [AppConfigService]
    },
    {
      provide: FirebaseOptionsToken,
      deps: [AppConfigService],
      useFactory: (acs: AppConfigService) => acs.appConfig.firebaseApp,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
