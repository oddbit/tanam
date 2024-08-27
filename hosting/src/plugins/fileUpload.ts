/**
 * Convert a base64-encoded string to a File.
 *
 * @param {string} base64String - The base64-encoded string.
 * @param {string} fileName - The name of the resulting File.
 * @returns {File} The resulting File object containing the file data.
 */
export function base64ToFile(base64String: string, fileName: string): File {
  // Split the base64 string into metadata and data parts
  const [metadata, data] = base64String.split(",");

  // Extract MIME type from metadata
  const mimeType = metadata.split(":")[1].split(";")[0];

  // Decode the base64 string into binary data
  const binaryString = window.atob(data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  // Convert binary string to byte array
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Create and return a File object from the byte array
  return new File([bytes], fileName, {type: mimeType});
}
