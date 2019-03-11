import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as path from 'path';
import { ObjectMetadata } from 'firebase-functions/lib/providers/storage';
import * as sharp from 'sharp';

class ImageData {
  bucketName: string;
  filePath: string;
  baseFileName: string;
  contentType: string;
  metadata: any;

  small: string;
  medium: string;
  large: string;

  constructor(inputImage: ObjectMetadata) {
    this.bucketName = inputImage.bucket;
    this.filePath = inputImage.name;
    this.baseFileName = path.basename(
      this.filePath,
      path.extname(this.filePath),
    );

    this.contentType = inputImage.contentType;
    this.metadata = {
      contentType: 'image/webp',
      metadata: inputImage.metadata,
    };

    const [tanamDir, imageDir] = this.filePath.split('/');

    const baseImagePath = path.join(tanamDir, imageDir, this.baseFileName);
    this.small = `${baseImagePath}_small.webp`;
    this.medium = `${baseImagePath}_medium.webp`;
    this.large = `${baseImagePath}_large.webp`;
  }
}

export const convertAndResizeImage = functions.storage.object().onFinalize(async (object: ObjectMetadata) => {
  const image = new ImageData(object);

  if (!image.contentType.startsWith('image/')) return null;
  if (image.filePath.endsWith('.webp')) return null;

  const bucket = admin.storage().bucket(image.bucketName);

  const [fileBuffer] = await bucket.file(image.filePath).download();

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
})
