import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { AppFirebaseModule } from './app-firebase.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DynamicPageComponent } from './dynamic-page/dynamic-page.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { TanamConfigService } from './services/tanam-config.service';

@NgModule({
  declarations: [
    AppComponent,
    DynamicPageComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'tanam-dynamic-render' }),
    AppRoutingModule,
    AppFirebaseModule,
    HttpClientModule,
    TransferHttpCacheModule,
  ],
  providers: [
    TanamConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: (tanamConfigService: TanamConfigService) => () => tanamConfigService.loadConfig(),
      multi: true,
      deps: [TanamConfigService]
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
