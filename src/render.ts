import * as dust from 'dustjs-linkedin';
import * as site from './site';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as content from './content';


// ----------------------------------------------------------------------------
// DUST HELPERS
// Implements Tanam helper extensions for the template engine
//
dust.helpers.debugDump = (chunk, context) => JSON.stringify(context);
dust.helpers.document = (chunk, context, bodies, params) => content.getDocumentByPath(params.path);
dust.helpers.documents = (chunk, context, bodies, params) =>
  content.getDocumentsInCollection(
    params.collection,
    params.orderBy || 'publishTime',
    params.sortOrder || 'desc',
    parseInt(params.limit) || 10);


/**
 * Renders a HTML page from a given Firestore document that contains Tanam content data.
 *
 * @param document Firestore content document
 */
export async function renderDocument(document: admin.firestore.DocumentSnapshot) {
  const contentDocument = new content.DocumentContext(document);
  const theme = await site.getThemeName();
  const templateFiles = await content.getTemplateFiles(theme);

  for (const file of templateFiles) {
    const [fileContent] = await file.download();
    const bytesOfData = (fileContent.byteLength / 1024).toFixed(2);
    console.log(`[renderDocument] Downloaded template: ${file.name} (${bytesOfData} kB)`);

    const templateName = file.name.substring(file.name.lastIndexOf('/') + 1, file.name.lastIndexOf('.dust'));
    console.log(`[renderDocument] Compiling template: ${templateName}`);
    const source = dust.compile(fileContent.toString('utf8'), templateName);
    dust.register(templateName, dust.loadSource(source));
  }

  return new Promise<string>((resolve, reject) => {
    dust.render(contentDocument.template, content.PageContext.createForDocument(contentDocument), (err: any, out: string) => {
      if (err) {
        console.log(`[renderDocument] Error rendering: ${JSON.stringify(err)}`);
        reject(JSON.stringify(err));
      } else {
        console.log(`[renderDocument] Finished rendering`);
        resolve(out);
      }
    });
  });
}


export function renderAdminPage(indexFileName: string, firebaseConfig: any) {

  const indexFile = fs.readFileSync(indexFileName, 'utf8');
  return new Promise((resolve, reject) => {
    dust.renderSource(indexFile, { fbConfig: firebaseConfig }, (err, out) => {
      if (err) {
        console.log(`Error rendering: ${JSON.stringify(err)}`);
        reject(err);
        return;
      }

      console.log(`[Finished rendering`);
      resolve(out);
    });
  });
}
