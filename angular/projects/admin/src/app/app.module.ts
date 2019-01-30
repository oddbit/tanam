import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { AdminModule } from './admin/admin.module';
import { AppFirebaseModule } from './app-firebase.module';
import { AppMaterialModule } from './app-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppConfigService } from './services/app-config.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AdminModule,

    // Important that AppRoutingModule is loaded *after* all other modules that define routing
    // since it declares the catch all wildcard route
    AppRoutingModule,

    BrowserTransferStateModule,
    HttpClientModule,
    LayoutModule,
    AppMaterialModule,
    AppFirebaseModule,
  ],
  providers: [
    AppConfigService,
    {
      provide: APP_INITIALIZER, // Asynchrounously load client's App Configuration
      useFactory: (appConfig: AppConfigService) => () => appConfig.loadConfig(),
      multi: true,
      deps: [AppConfigService]
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
