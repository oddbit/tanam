import { LayoutModule } from '@angular/cdk/layout';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppConfigService } from './services/app-config.service';
import { AdminModule } from './admin/admin.module';
import { AppMaterialModule } from './app-material.module';
import { AppFirebaseModule } from './app-firebase.module';
import { RenderTemplateComponent } from './render-template/render-template.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    RenderTemplateComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'tanam' }),
    AdminModule,

    // Important that AppRoutingModule is loaded *after* all other modules that define routing
    // since it declares the catch all wildcard route
    AppRoutingModule,

    // AppFirebaseModule,
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
      useFactory: (appConfig: AppConfigService) => () => appConfig.loadAppConfig(),
      multi: true,
      deps: [AppConfigService]
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
