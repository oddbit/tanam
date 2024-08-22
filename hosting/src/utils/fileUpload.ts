// Enum to define acceptable file types for the Dropzone component
export enum AcceptFileType {
  AllImages = "image/*",
  Images = "image/jpg, image/jpeg, image/png, image/svg",
  Pdf = "application/pdf",
  Word = "application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  Excel = "application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  PowerPoint = "application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation",
  Text = "text/plain",
  Audio = "audio/*",
  Video = "video/*",
  Zip = "application/zip, application/x-rar-compressed, application/x-7z-compressed",
  Csv = "text/csv",
  AllFiles = "*/*",
}

/**
 * Converts a base64 string to a Blob object.
 * @param {string} base64 - Base64 string of the file.
 * @param {string} contentType - MIME type of the file (e.g., 'image/jpeg', 'application/pdf').
 * @return {Blob} - The Blob object created from the base64 string.
 */
export function base64ToBlob(base64: string, contentType: string): Blob {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
  const byteArray = new Uint8Array(byteNumbers);

  return new Blob([byteArray], { type: contentType });
};

/**
 * Gets the file extension based on the MIME type.
 * @param {string} contentType - MIME type of the file (e.g., 'image/jpeg', 'application/pdf').
 * @return {string} - File extension based on MIME type.
 */
export function getFileExtension(contentType: string): string {
  const mimeTypeToExtension: { [key: string]: string } = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/bmp': '.bmp',
    'image/webp': '.webp',
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/vnd.ms-excel': '.xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'application/vnd.ms-powerpoint': '.ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
    'text/plain': '.txt',
    'text/html': '.html',
    'text/css': '.css',
    'application/javascript': '.js',
    'application/json': '.json',
    'application/zip': '.zip',
    'application/x-rar-compressed': '.rar',
    'application/x-7z-compressed': '.7z',
    // Add more mappings as needed
  };
  
  return mimeTypeToExtension[contentType] || '';
};

/**
 * Utility function to get a user-friendly description of the accepted file types.
 * @param {AcceptFileType} accept - The accept enum value.
 * @return {string} A descriptive string for the accepted file types.
 */
export function getAcceptDescription(accept: AcceptFileType): string {
  switch (accept) {
    case AcceptFileType.AllImages:
      return "Any image type";
    case AcceptFileType.Images:
      return "Images (JPG, PNG, SVG)";
    case AcceptFileType.Pdf:
      return "PDF files";
    case AcceptFileType.Word:
      return "Word documents";
    case AcceptFileType.Excel:
      return "Excel spreadsheets";
    case AcceptFileType.PowerPoint:
      return "PowerPoint presentations";
    case AcceptFileType.Text:
      return "Text files";
    case AcceptFileType.Audio:
      return "Audio files";
    case AcceptFileType.Video:
      return "Video files";
    case AcceptFileType.Zip:
      return "Compressed files (ZIP, RAR, 7z)";
    case AcceptFileType.Csv:
      return "CSV files";
    case AcceptFileType.AllFiles:
    default:
      return "Any file type";
  }
}

/**
 * Checks if the file is accepted based on the MIME type.
 * @param {File} file - The file object to be checked.
 * @param {AcceptFileType} accept - The accepted file type.
 * @return {boolean} - True if the file is accepted, otherwise false.
 */
export function isFileAccepted(file: File, accept: AcceptFileType): boolean {
  const fileExtension = getFileExtension(file.type);
  const acceptedMimeTypes = accept.split(',').map(type => type.trim());

  // Check if the file's MIME type matches any of the accepted MIME types
  return acceptedMimeTypes.some(type => type === file.type || fileExtension === getFileExtension(type));
}