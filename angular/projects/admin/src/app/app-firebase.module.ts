import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireModule, FirebaseOptionsToken } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AppConfigService } from './services/app-config.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AngularFireModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule
  ],
  exports: [
    CommonModule,
    AngularFireAuthModule,
    AngularFireModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule
  ],
  providers: [
    AppConfigService,
    {
      provide: FirebaseOptionsToken,
      deps: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => appConfigService.firebaseConfig,
    },
  ],
})
export class AppFirebaseModule { }
