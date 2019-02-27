import * as path from 'path';
import * as os from 'os';
import { ObjectMetadata } from 'firebase-functions/lib/providers/storage';

const WEBP_EXTENSION = '.webp';

export class ImageData {
  bucketName: string;
  filePath: string;
  baseFileName: string;
  fileDir: string;
  imageFilePath: string;
  tempLocalFile: string;
  tempLocalDir: string;
  tempLocalJPEGFile: string;
  contentType: string;
  metadata: any;

  constructor(inputImage: ObjectMetadata) {
    this.bucketName = inputImage.bucket;
    this.filePath = inputImage.name;
    this.baseFileName = path.basename(
      this.filePath,
      path.extname(this.filePath),
    );
    this.fileDir = path.dirname(this.filePath);
    this.imageFilePath = path.normalize(
      path.format({
        dir: this.fileDir,
        name: this.baseFileName,
        ext: WEBP_EXTENSION,
      }),
    );

    this.tempLocalFile = path.join(os.tmpdir(), this.filePath);
    this.tempLocalDir = path.dirname(this.tempLocalFile);
    this.tempLocalJPEGFile = path.join(os.tmpdir(), this.imageFilePath);

    this.contentType = inputImage.contentType;
    this.metadata = {
      contentType: this.contentType,
      metadata: inputImage.metadata,
    };
  }
}
