import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DocumentTemplate, SiteInformation, TanamDocumentContext } from 'tanam-models';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  readonly siteCollection = this.firestore.collection('tanam').doc<SiteInformation>(this.appConfig.siteId);

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly appConfig: AppConfigService,
  ) { }

  getTemplate(documentContext: TanamDocumentContext): Observable<DocumentTemplate> {
    return this.siteCollection.
      valueChanges()
      .pipe(switchMap(siteInfo => {
        return this.siteCollection
          .collection('themes').doc(siteInfo.theme)
          .collection('templates').doc<DocumentTemplate>(documentContext.documentType)
          .valueChanges();
      }));
  }

  getTemplates(): Observable<DocumentTemplate[]> {


    return this.siteCollection
      .valueChanges()
      .pipe(switchMap(settings =>
        this.siteCollection
          .collection('themes').doc(settings.theme)
          .collection<DocumentTemplate>('templates')
          .valueChanges()));

  }
}
