import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { SiteInformation } from '../models';

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
