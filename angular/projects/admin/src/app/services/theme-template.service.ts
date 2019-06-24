import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { ThemeTemplate, Theme, DocumentType, ThemeTemplateQueryOptions } from 'tanam-models';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeTemplateService {
  readonly siteCollection = this.firestore.collection('tanam').doc(this.appConfig.siteId);

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly appConfig: AppConfigService,
  ) { }

  getTemplate(theme: string, template: string): Observable<ThemeTemplate> {
    return this.siteCollection
      .collection('themes').doc(theme)
      .collection('templates').doc<ThemeTemplate>(template)
      .valueChanges();
  }

  getReference(themeId: string, templateId: string) {
    return this.siteCollection
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
    return this.siteCollection
      .collection('themes').doc(theme)
      .collection<ThemeTemplate>('templates', queryFn)
      .valueChanges();
  }

  async createTemplateInTheme(theme: Theme, title: string, selector: string) {
    const templatesCollection = this.siteCollection
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

  saveTemplate(template: ThemeTemplate, themeId: string) {
    template.updated = firebase.firestore.FieldValue.serverTimestamp();
    return this.siteCollection
      .collection('themes')
      .doc(themeId)
      .collection('templates')
      .doc<ThemeTemplate>(template.id)
      .update(template);
  }

  deleteTemplate(templateId: string, themeId: string) {
    console.log(templateId);
    console.log(themeId);
    if (!templateId && themeId) {
      throw new Error('Template ID and Theme id must be provided as an attribute when deleting a template.');
    }
    return this.siteCollection
      .collection('themes')
      .doc(themeId)
      .collection('templates')
      .doc(templateId)
      .delete();
  }
}
