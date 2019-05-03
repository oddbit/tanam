import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { TanamFile } from '../models';

export const deleteStorageFiles = functions.firestore.document('tanam/{siteId}/files/{fileId}').onDelete(async (snap) => {
    const file = snap.data() as TanamFile;
    const filePrefix = file.filePath.substr(0, file.filePath.lastIndexOf('.'));
    console.log(`Delete all files starting with ${filePrefix}`);
    return admin.storage().bucket().deleteFiles({
        prefix: filePrefix,
    });
});

export const deleteAssetFile = functions.firestore.document('tanam/{siteId}/themes/{themeId}/assets/{assetId}').onDelete(async (snap) => {
  const file = snap.data() as TanamFile;
  const filePrefix = file.filePath.substr(0, file.filePath.lastIndexOf('.'));
  console.log(`Delete all asset files starting with ${filePrefix}`);
  return admin.storage().bucket().deleteFiles({
      prefix: filePrefix,
  });
});
