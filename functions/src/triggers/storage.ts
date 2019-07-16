import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as sharp from 'sharp';
import { TanamFile } from '../models';
import { SHA1 } from 'crypto-js';

// noinspection JSUnusedGlobalSymbols
export const onUserImageUpload = functions.storage.object().onFinalize(async (storageObject) => {
  const regexNameMatch = storageObject.name.match(/^\/?tanam\/(.*)\/upload\//);
  if (!regexNameMatch) {
    console.log(`Not a user image upload task: ${storageObject.name} (${storageObject.contentType})`);
    return null;
  }

  if (!storageObject.contentType.startsWith('image/')) {
    console.log(`File is not an image: ${storageObject.name} (${storageObject.contentType})`);
    return null;
  }

  console.log(`Processing file: ${storageObject.name}`);
  const siteId = regexNameMatch[1];
  const bucket = admin.storage().bucket(storageObject.bucket);
  const [originalFileBuffer] = await bucket.file(storageObject.name).download();

  const resizeAndConvertImage = (size: number) =>
    sharp(originalFileBuffer)
      .resize(size, size, {
        withoutEnlargement: true,
        fit: sharp.fit.inside,
      })
      .toFormat(sharp.format.webp)
      .toBuffer();

  const originalSuffix = storageObject.name.lastIndexOf('.') > 0
    ? storageObject.name.substr(storageObject.name.lastIndexOf('.'))
    : '';

  const firestoreRef = admin.firestore()
    .collection('tanam').doc(siteId)
    .collection('files').doc();

  const newFileName = firestoreRef.id;
  const newFilePath = `tanam/${siteId}/images/`;
  const metadata = {
    contentType: 'image/webp',
    metadata: storageObject.metadata,
  };

  const tanamFile: TanamFile = {
    id: firestoreRef.id,
    title: storageObject.name.substr(storageObject.name.lastIndexOf('/') + 1),
    bucket: storageObject.bucket,
    filePath: [newFilePath, newFileName, originalSuffix].join(''),
    updated: admin.firestore.FieldValue.serverTimestamp(),
    created: admin.firestore.FieldValue.serverTimestamp(),
    bytes: originalFileBuffer.byteLength,
    variants: {
      small: `${newFilePath}${newFileName}_small.webp`,
      medium: `${newFilePath}${newFileName}_medium.webp`,
      large: `${newFilePath}${newFileName}_large.webp`,
    },
    mimeType: storageObject.contentType,
    fileType: 'image',
  };

  return await Promise.all([
    firestoreRef.set(tanamFile),
    bucket.file(storageObject.name).delete(),
    bucket.file(tanamFile.filePath).save(originalFileBuffer, storageObject.metadata),
    bucket.file(tanamFile.variants.small).save(await resizeAndConvertImage(300), metadata),
    bucket.file(tanamFile.variants.medium).save(await resizeAndConvertImage(800), metadata),
    bucket.file(tanamFile.variants.large).save(await resizeAndConvertImage(1600), metadata),
  ]);
});


// noinspection JSUnusedGlobalSymbols
export const onThemeAssetsFileUpload = functions.storage.object().onFinalize(async (storageObject) => {
  const regexNameMatch = storageObject.name.match(/^\/?tanam\/(.*)\/themes\//);

  if (!regexNameMatch) {
    console.log(`Not an upload asset file task: ${storageObject.name} (${storageObject.contentType})`);
    return null;
  }
  console.log('[UploadAssetFiles]' + JSON.stringify(storageObject));
  const objectNameArr = storageObject.name.split('/');
  const themeId = objectNameArr[3];

  const siteId = regexNameMatch[1];
  const fileId = SHA1(storageObject.name).toString().toLowerCase();

  const fileRef = admin.firestore()
    .collection('tanam').doc(siteId)
    .collection('themes').doc(themeId)
    .collection('assets').doc(fileId);

  const fileData = {
    id: fileId,
    title: storageObject.name.substr(storageObject.name.lastIndexOf('/') + 1),
    bucket: storageObject.bucket,
    filePath: storageObject.name,
    updated: admin.firestore.FieldValue.serverTimestamp(),
    bytes: Number(storageObject.size),
    mimeType: storageObject.contentType,
    fileType: storageObject.contentType,
  } as TanamFile;

  const fileDoc = await fileRef.get();
  if (!fileDoc.exists) {
    fileData.created = admin.firestore.FieldValue.serverTimestamp();
  }

  return fileRef.set(fileData);
});
