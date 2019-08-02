import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { TanamSite, Theme, ThemeTemplate, ThemeTemplateQueryOptions } from 'tanam-models';
import { switchMap, take } from 'rxjs/operators';
import { SiteService } from './site.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeTemplateService {
  constructor(
    private readonly siteService: SiteService,
    private readonly firestore: AngularFirestore,
  ) {
  }

  getTemplate(theme: string, template: string): Observable<ThemeTemplate> {
    return this.siteService.getCurrentSite().pipe(
      switchMap((site) =>
        this.firestore
          .collection('tanam').doc(site.id)
          .collection('themes').doc(theme)
          .collection('templates').doc<ThemeTemplate>(template)
          .valueChanges(),
      )
    );
  }

  async getReference(themeId: string, templateId: string) {
    const currentSite = await this._currentSite;
    return this.firestore
      .collection('tanam').doc(currentSite.id)
      .collection('themes').doc(themeId)
      .collection('templates').doc(templateId)
      .ref.get();
  }

  getTemplatesForTheme(theme: string, queryOpts?: ThemeTemplateQueryOptions) {
    const queryFn = (ref: CollectionReference) => {
      if (queryOpts) {
        let query: Query = ref;
        if (queryOpts.orderBy) {
          query = query.orderBy(queryOpts.orderBy.field, queryOpts.orderBy.sortOrder);
        }
        if (queryOpts.startAfter) {
          query = query.startAfter(queryOpts.startAfter);
        }
        if (queryOpts.limit) {
          query = query.limit(queryOpts.limit);
        }
        return query;
      }
      return ref;
    };

    return this.siteService.getCurrentSite().pipe(
      switchMap((site) =>
        this.firestore
          .collection('tanam').doc(site.id)
          .collection('themes').doc(theme)
          .collection<ThemeTemplate>('templates', queryFn)
          .valueChanges(),
      )
    );
  }

  async createTemplateInTheme(theme: Theme, title: string, selector: string) {
    const currentSite = await this._currentSite;
    const templatesCollection = this.firestore
      .collection('tanam').doc(currentSite.id)
      .collection('themes').doc(theme.id)
      .collection('templates');

    const template: ThemeTemplate = {
      id: selector,
      title: title,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      updated: firebase.firestore.FieldValue.serverTimestamp(),
      selector: selector,
      templateType: 'dust',
      template: `<h1>Template ${title} worked</h1>`,
    };
    return templatesCollection.doc(template.id).set(template);
  }

  async saveTemplate(template: ThemeTemplate, themeId: string) {
    template.updated = firebase.firestore.FieldValue.serverTimestamp();
    const currentSite = await this._currentSite;
    return this.firestore
      .collection('tanam').doc(currentSite.id)
      .collection('themes').doc(themeId)
      .collection('templates').doc<ThemeTemplate>(template.id)
      .update(template);
  }

  async deleteTemplate(templateId: string, themeId: string) {
    console.log(templateId);
    console.log(themeId);
    if (!templateId && themeId) {
      throw new Error('Template ID and Theme id must be provided as an attribute when deleting a template.');
    }

    const currentSite = await this._currentSite;
    return this.firestore
      .collection('tanam').doc(currentSite.id)
      .collection('themes').doc(themeId)
      .collection('templates').doc(templateId)
      .delete();
  }

  get _currentSite(): Promise<TanamSite> {
    return this.siteService.getCurrentSite().pipe(take(1)).toPromise();
  }
}
