import { LayoutModule } from '@angular/cdk/layout';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
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
import { SettingsDomainComponent } from './settings-domain/settings-domain.component';
import { SettingsSiteComponent } from './settings-site/settings-site.component';
import { AngularFireModule, FirebaseOptionsToken } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { ContentTypeComponent } from './content-type/content-type.component';
import { ContentTypeDetailsComponent } from './content-type-details/content-type-details.component';
import { AppConfigService } from './app-config.service';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    DashboardComponent,
    SettingsComponent,
    NavigationComponent,
    SettingsDomainComponent,
    SettingsSiteComponent,
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
