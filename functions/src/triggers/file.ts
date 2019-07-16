import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { TanamFile, ISiteInformation } from '../models';
import * as taskService from '../services/task.service';

// noinspection JSUnusedGlobalSymbols
export const onDeleteUserFile = functions.firestore.document('tanam/{siteId}/files/{fileId}').onDelete(async (snap, context) => {
    const siteId = context.params.siteId;
    const fileId = context.params.fileId;
    const file = snap.data() as TanamFile;
    const filePrefix = file.filePath.substr(0, file.filePath.lastIndexOf('.'));
    console.log(`Delete all files starting with ${filePrefix}`);

    const cacheUrls = [`/_/file/${fileId}`];
    for (const key in file.variants) {
        if (file.variants.hasOwnProperty(key)) {
            cacheUrls.push(`/_/file/${fileId}?size=${key}`);
        }
    }
    console.log(`Clearing cache: ${JSON.stringify(cacheUrls)}`);
    return Promise.all([
        ...cacheUrls.map(url => taskService.cacheTask('delete', siteId, url)),
        admin.storage().bucket().deleteFiles({ prefix: filePrefix }),
    ])
});

// noinspection JSUnusedGlobalSymbols
export const onCreateThemeAssetsFile = functions.firestore.document('tanam/{siteId}/themes/{themeId}/assets/{assetId}').onCreate(async (snap, context) => {
    const siteId = context.params.siteId;
    const themeId = context.params.themeId;
    console.log(`Creating file in ${JSON.stringify({ siteId, themeId })}`);

    const siteInfo = (await admin.firestore().collection('tanam').doc(siteId).get()).data() as ISiteInformation;
    console.log(`Active theme: ${siteInfo.theme}`);

    if (siteInfo.theme !== themeId) {
        console.log(`Creating file in a theme that is not active. No need to heat cache.`);
        return null;
    }

    const file = snap.data() as TanamFile;
    return taskService.cacheTask('create', siteId, `/_/theme/${encodeURIComponent(file.title)}`);
});

// noinspection JSUnusedGlobalSymbols
export const onUpdateThemeAssetsFile = functions.firestore.document('tanam/{siteId}/themes/{themeId}/assets/{assetId}').onUpdate(async (change, context) => {
    const siteId = context.params.siteId;
    const themeId = context.params.themeId;
    console.log(`Updating file in ${JSON.stringify({ siteId, themeId })}`);

    const siteInfo = (await admin.firestore().collection('tanam').doc(siteId).get()).data() as ISiteInformation;
    console.log(`Active theme: ${siteInfo.theme}`);

    if (siteInfo.theme !== themeId) {
        console.log(`Updating file in a theme that is not active. No need to refresh cache.`);
        return null;
    }

    const file = change.after.data() as TanamFile;
    return taskService.cacheTask('update', siteId, `/_/theme/${encodeURIComponent(file.title)}`);
});

// noinspection JSUnusedGlobalSymbols
export const onDeleteThemeAssetsFile = functions.firestore.document('tanam/{siteId}/themes/{themeId}/assets/{assetId}').onDelete(async (snap, context) => {
    const siteId = context.params.siteId;
    const themeId = context.params.themeId;
    console.log(`Deleting file in ${JSON.stringify({ siteId, themeId })}`);

    const siteInfo = (await admin.firestore().collection('tanam').doc(siteId).get()).data() as ISiteInformation;
    console.log(`Active theme: ${siteInfo.theme}`);

    if (siteInfo.theme !== themeId) {
        console.log(`Updating file in a theme that is not active. No need to refresh cache.`);
        return null;
    }

    const file = snap.data() as TanamFile;
    const filePrefix = file.filePath.substr(0, file.filePath.lastIndexOf('.'));
    console.log(`Delete all asset files starting with ${filePrefix}`);
    return Promise.all([
        taskService.cacheTask('delete', siteId, `/_/theme/${encodeURIComponent(file.title)}`),
        admin.storage().bucket().file(file.filePath).delete(),
    ])
});
