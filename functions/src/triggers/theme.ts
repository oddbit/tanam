import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Document, SiteInformation, TanamFile } from '../models';
import * as taskService from '../services/task.service';

export const onUpdateActiveTheme = functions.firestore.document('tanam/{siteId}').onUpdate(async (change, context) => {
  const siteId = context.params.siteId;
  const siteInfoBefore = change.before.data() as SiteInformation;
  const siteInfoAfter = change.after.data() as SiteInformation;
  if (siteInfoBefore.theme === siteInfoAfter.theme) {
    console.log(`Active theme is unchanged. Nothing to do.`);
    return null;
  }

  const promises = [];

  const oldAssetFiles = await admin.firestore()
    .collection('tanam').doc(siteId)
    .collection('themes').doc(siteInfoBefore.theme)
    .collection('assets')
    .get();

  console.log(`Clearing cache for ${oldAssetFiles.docs.length} assets in previous theme (${siteInfoBefore.theme}).`);
  for (const doc of oldAssetFiles.docs) {
    const file = doc.data() as TanamFile;
    promises.push(taskService.deleteCache(siteId, `/_/theme/${encodeURIComponent(file.title)}`));
  }

  const currentAssetFiles = await admin.firestore()
    .collection('tanam').doc(siteId)
    .collection('themes').doc(siteInfoAfter.theme)
    .collection('assets')
    .get();

  console.log(`Heating cache for ${currentAssetFiles.docs.length} assets in current theme (${siteInfoAfter.theme}).`);
  for (const doc of currentAssetFiles.docs) {
    const file = doc.data() as TanamFile;
    promises.push(taskService.createCache(siteId, `/_/theme/${encodeURIComponent(file.title)}`));
  }

  const publishedDocs = await admin.firestore()
    .collection('tanam').doc(siteId)
    .collection('documents')
    .where('status', '==', 'published')
    .get();

  console.log(`Updating cache for ${publishedDocs.docs.length} published documents.`);
  for (const doc of publishedDocs.docs) {
    const document = doc.data() as Document;
    promises.push(taskService.updateCache(siteId, document.url));
  }

  return Promise.all(promises);
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

  console.log(`Updating cache for ${publishedDocs.docs.length} published documents.`);
  const promises = [];
  for (const doc of publishedDocs.docs) {
    const document = doc.data() as Document;
    promises.push(taskService.updateCache(siteId, document.url));
  }

  return Promise.all(promises);
});
