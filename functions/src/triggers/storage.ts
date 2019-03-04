import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { ObjectMetadata } from 'firebase-functions/lib/providers/storage';
import * as sharp from 'sharp';

import { ImageData } from '../../../models/image-data.models';

export const convertToWebP = functions.storage.object().onFinalize(async (object: ObjectMetadata) => {
  const image = new ImageData(object);

  if (!image.contentType.startsWith('image/')) return null;
  if (image.filePath.endsWith('.webp')) return null;

  const bucket = admin.storage().bucket(image.bucketName);

  const [fileBuffer] = await bucket.file(image.filePath).download();

  await convertAndResizeImage(fileBuffer, image, bucket);

  return null;
})

async function convertAndResizeImage(fileBuffer, image, bucket) {
  const resiveAndConvertImage = size =>
    sharp(fileBuffer)
      .resize(size, size, {
        withoutEnlargement: true,
        fit: sharp.fit.cover,
        position: sharp.strategy.entropy,
      })
      .toFormat(sharp.format.webp)
      .toBuffer();

  return await Promise.all([
    bucket
      .file(image.small)
      .save(await resiveAndConvertImage(300), image.metadata),
    bucket
      .file(image.medium)
      .save(await resiveAndConvertImage(800), image.metadata),
    bucket
      .file(image.large)
      .save(await resiveAndConvertImage(1600), image.metadata),
  ]);
}
