/**
 * Converts a base64 string to a Blob object.
 * @param {string} base64 - Base64 string of the file.
 * @param {string} contentType - MIME type of the file (e.g., 'image/jpeg', 'application/pdf').
 * @return {Blob} - The Blob object created from the base64 string.
 */
export function base64ToBlob(base64: string, contentType: string) {
  const sliceSize = 512;
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

/**
 * Gets the file extension based on the MIME type.
 * @param {string} contentType - MIME type of the file (e.g., 'image/jpeg', 'application/pdf').
 * @return {string} - File extension based on MIME type.
 */
export function getFileExtension(contentType: string) {
  const mimeTypeToExtension: { [key: string]: string } = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'application/pdf': '.pdf',
    'text/plain': '.txt',
    // Add more mappings as needed
  };
  
  return mimeTypeToExtension[contentType] || '';
};