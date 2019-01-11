import { LayoutModule } from '@angular/cdk/layout';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminNavigationComponent } from './admin-navigation/admin-navigation.component';
import { AppConfigService } from './app-config.service';
import { HttpClientModule } from '@angular/common/http';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';
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
} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminSettingsDomainComponent } from './admin-settings-domain/admin-settings-domain.component';
import { AdminSettingsSiteComponent } from './admin-settings-site/admin-settings-site.component';
import { AngularFireModule, FirebaseOptionsToken } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { ContentTypeComponent } from './content-type/content-type.component';
import { ContentTypeDetailsComponent } from './content-type-details/content-type-details.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminNavigationComponent,
    AdminDashboardComponent,
    AdminSettingsComponent,
    AdminNavigationComponent,
    AdminSettingsDomainComponent,
    AdminSettingsSiteComponent,
    ContentTypeComponent,
    ContentTypeDetailsComponent,
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
