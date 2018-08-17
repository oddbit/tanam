// See spec https://firebase.google.com/docs/database/usage/limits#data_tree
const FIREBASE_KEY_MAX_LENGTH = 768;

export function encodeRoutingTablePath(path) {
  const base64encodedPath = Buffer.from(path).toString('base64');
  const encodedPathBuffer = Buffer.from(base64encodedPath);
  const encodedByteLength = encodedPathBuffer.length;
  console.log(`Encoding path: ${path} resulted in ${encodedByteLength} bytes base64 string: ${base64encodedPath}`);

  const routingTable = [];
  for (let i = 0; i < encodedByteLength; i += FIREBASE_KEY_MAX_LENGTH) {
    const slice = encodedPathBuffer.slice(i, i + FIREBASE_KEY_MAX_LENGTH);
    routingTable.push(slice.toString());
  }
  return routingTable.join('/');
}