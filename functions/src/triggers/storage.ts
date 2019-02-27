import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as mkdirp from 'mkdirp-promise';
import { ObjectMetadata } from 'firebase-functions/lib/providers/storage';

import { ImageData } from '../../../models/image-data.models';

const spawn = require('child-process-promise').spawn;

export const convertToWebP = functions.storage.object().onFinalize(async (object: ObjectMetadata) => {
  const image = new ImageData(object);

  if (!image.contentType.startsWith('image/')) return null;
  if (image.baseFileName.endsWith('.webp')) return null;

  const bucket = admin.storage().bucket(image.bucketName);

  await mkdirp(image.tempLocalDir);
  await bucket
    .file(image.filePath)
    .download({ destination: image.tempLocalFile });
  console.log('The file has been downloaded to', image.tempLocalFile);

  await spawn('convert', [image.tempLocalFile, image.tempLocalWebPFile]);
  console.log('WebP image created at', image.tempLocalWebPFile);

  await bucket.upload(image.tempLocalWebPFile, {
    destination: image.imageFilePath,
  });

  return null;
})
