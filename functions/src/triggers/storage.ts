import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { ObjectMetadata } from 'firebase-functions/lib/providers/storage';
import * as sharp from 'sharp';
import { TanamFile } from '../models';

export const processImageUpload = functions.storage.object().onFinalize(async (object: ObjectMetadata) => {
  if (!object.name.startsWith(`tanam/${process.env.GCLOUD_PROJECT}/upload/`)) {
    console.log(`Not an upload task: ${object.name} (${object.contentType})`);
    return null;
  }

  if (!object.contentType.startsWith('image/')) {
    console.log(`File is not an image: ${object.name} (${object.contentType})`);
    return null;
  }

  console.log(`Processing file: ${object.name}`);
  const bucket = admin.storage().bucket(object.bucket);
  const [originalFileBuffer] = await bucket.file(object.name).download();

  const resizeAndConvertImage = (size: number) =>
    sharp(originalFileBuffer)
      .resize(size, size, {
        withoutEnlargement: true,
        fit: sharp.fit.inside,
      })
      .toFormat(sharp.format.webp)
      .toBuffer();

  const originalSuffix = object.name.lastIndexOf('.') > 0 ? object.name.substr(object.name.lastIndexOf('.')) : '';
  const firestoreRef = admin.firestore()
    .collection('tanam').doc(process.env.GCLOUD_PROJECT)
    .collection('files').doc();

  const newFileName = firestoreRef.id;
  const newFilePath = `tanam/${process.env.GCLOUD_PROJECT}/images/`;
  const metadata = {
    contentType: 'image/webp',
    metadata: object.metadata,
  };

  const tanamFile: TanamFile = {
    id: firestoreRef.id,
    title: object.name.substr(object.name.lastIndexOf('/') + 1),
    bucket: object.bucket,
    filePath: [newFilePath, newFileName, originalSuffix].join(''),
    updated: admin.firestore.FieldValue.serverTimestamp(),
    created: admin.firestore.FieldValue.serverTimestamp(),
    bytes: originalFileBuffer.byteLength,
    variants: {
      small: `${newFilePath}${newFileName}_small.webp`,
      medium: `${newFilePath}${newFileName}_medium.webp`,
      large: `${newFilePath}${newFileName}_large.webp`,
    },
    mimeType: object.contentType,
    fileType: 'image',
  };

  return await Promise.all([
    firestoreRef.set(tanamFile),
    bucket.file(object.name).delete(),
    bucket.file(tanamFile.filePath).save(originalFileBuffer, object.metadata),
    bucket.file(tanamFile.variants.small).save(await resizeAndConvertImage(300), metadata),
    bucket.file(tanamFile.variants.medium).save(await resizeAndConvertImage(800), metadata),
    bucket.file(tanamFile.variants.large).save(await resizeAndConvertImage(1600), metadata),
  ]);
});


export const uploadAssetFiles = functions.storage.object().onFinalize(async (object: ObjectMetadata) => {

  if (!object.name.startsWith(`tanam/${process.env.GCLOUD_PROJECT}/themes/`)) {
    console.log(`Not an upload asset file task: ${object.name} (${object.contentType})`);
    return null;
  }
  console.log('[UploadAssetFiles]' + JSON.stringify(object))

  const objectNameArr = object.name.split('/');
  const themeId = objectNameArr[3];

  const originalSuffix = object.name.lastIndexOf('.') > 0 ? object.name.substr(object.name.lastIndexOf('.')) : '';
  const firestoreRef = admin.firestore()
    .collection('tanam').doc(process.env.GCLOUD_PROJECT)
    .collection('themes').doc(themeId)
    .collection('assets').doc()


  const newFileName = firestoreRef.id;
  const newFilePath = `tanam/${process.env.GCLOUD_PROJECT}/images/`;

  const tanamFile: TanamFile = {
    id: firestoreRef.id,
    title: object.name.substr(object.name.lastIndexOf('/') + 1),
    bucket: object.bucket,
    filePath: [newFilePath, newFileName, originalSuffix].join(''),
    updated: admin.firestore.FieldValue.serverTimestamp(),
    created: admin.firestore.FieldValue.serverTimestamp(),
    bytes: Number(object.size),
    mimeType: object.contentType,
    fileType: object.contentType,
  };

  return firestoreRef.set(tanamFile);
});
