import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Document, SiteInformation } from '../models';
import * as taskService from '../services/task.service';

export const onUpdateActiveTheme = functions.firestore.document('tanam/{siteId}').onUpdate(async (change) => {
  const siteInfoBefore = change.before.data() as SiteInformation;
  const siteInfoAfter = change.after.data() as SiteInformation;
  if (siteInfoBefore.theme === siteInfoAfter.theme) {
    console.log(`Active theme is unchanged. Nothing to do.`);
    return null;
  }

  console.log(`TODO: Update all old assets`);
  console.log(`TODO: Update all document URLs`);
});

export const onDeleteThemeDeleteTemplates = functions.firestore.document('tanam/{siteId}/themes/{themeId}').onDelete(async (snap) => {
  console.log(`Deleting all templates for theme ${snap.data().title} (${snap.data().id})`);
  const templates = await snap.ref.collection('templates').get();

  const promises = [];
  const batchDeletes = [];

  for (let i = 0; i < templates.docs.length; i++) {
    const doc = templates.docs[i];
    if ((i % 500) === 0) {
      batchDeletes.push(admin.firestore().batch());
    }

    const batchNum = batchDeletes.length - 1;
    console.log(`Batch delete #${batchNum} (${i + 1}/500): ${doc.id}`);
    batchDeletes[batchNum].delete(doc.ref);
  }

  batchDeletes.forEach((batchWrite) => {
    promises.push(batchWrite.commit());
  });

  return Promise.all(promises);
});

export const onDeleteThemeDeleteAssets = functions.firestore.document('tanam/{siteId}/themes/{themeId}').onDelete(async (snap) => {
  console.log(`Deleting all assets for theme ${snap.data().title} (${snap.data().id})`);
  const assets = await snap.ref.collection('assets').get();

  const promises = [];
  const batchDeletes = [];

  for (let i = 0; i < assets.docs.length; i++) {
    const doc = assets.docs[i];
    if ((i % 500) === 0) {
      batchDeletes.push(admin.firestore().batch());
    }

    const batchNum = batchDeletes.length - 1;
    console.log(`Batch delete #${batchNum} (${i + 1}/500): ${doc.id}`);
    batchDeletes[batchNum].delete(doc.ref);
  }

  batchDeletes.forEach((batchWrite) => {
    promises.push(batchWrite.commit());
  });

  return Promise.all(promises);
});

export const onWriteTemplateUpdateCache = functions.firestore.document('tanam/{siteId}/themes/{themeId}/templates/{templateId}').onWrite(async (change, context) => {
  const siteId = context.params.siteId;
  const themeId = context.params.themeId;
  const templateId = context.params.themeId;
  console.log(`Writing to template ${JSON.stringify({ siteId, themeId, templateId })}`)

  const siteInfo = (await admin.firestore().collection('tanam').doc(siteId).get()).data() as SiteInformation;
  console.log(`Active theme: ${siteInfo.theme}`);

  if (siteInfo.theme !== themeId) {
    console.log(`Writing template in a theme that is not active. No need to refresh cache.`);
    return null;
  }

  const publishedDocs = await admin.firestore()
    .collection('tanam').doc(siteId)
    .collection('documents')
    .where('status', '==', 'published')
    .get();

  const promises = [];
  for (const doc of publishedDocs.docs) {
    const document = doc.data() as Document;
    promises.push(taskService.updateCache(siteId, document.url));
  }

  return Promise.all(promises);
});
