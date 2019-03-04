import * as path from 'path';
import { ObjectMetadata } from 'firebase-functions/lib/providers/storage';

export class ImageData {
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
