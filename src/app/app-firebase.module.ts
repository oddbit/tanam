import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule, FirebaseOptionsToken } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AppConfigService } from './services/app-config.service';
import { AngularFireAuthModule } from '@angular/fire/auth';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AngularFireModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
  ],
  exports: [
    CommonModule,
    AngularFireAuthModule,
    AngularFireModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
  ],
  providers: [
    AppConfigService,
    {
      provide: FirebaseOptionsToken,
      deps: [AppConfigService],
      useFactory: (acs: AppConfigService) => acs.appConfig.firebaseApp,
    },
  ],
})
export class AppFirebaseModule { }
