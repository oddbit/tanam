import * as express from 'express';
import * as functions from 'firebase-functions';
import { TANAM_BROWSER_CACHE_SECONDS, TANAM_SERVER_CACHE_SECONDS } from "../definitions/cache.constants";
import { TanamFile } from "../models";
import * as fileService from "../services/file.service";
import { getPageContextByUrl } from "../services/page-context.service";
import { renderPage, renderPage404 } from "../render";

const app = express();
export const tanam = functions.https.onRequest(app);


/**
 * Get a cache header string that can be set in a HTTP response header.
 */
export function getCacheHeader(): string {
  const functionsConf = functions.config().cache || {};
  const maxAge = functionsConf.max_age || TANAM_BROWSER_CACHE_SECONDS;
  const sMaxAge = functionsConf.s_max_age || TANAM_SERVER_CACHE_SECONDS;

  console.log(`[getCacheHeader] ${JSON.stringify({maxAge, sMaxAge})}`);
  return `public, max-age=${maxAge}, s-maxage=${sMaxAge}, stale-while-revalidate=120`;
}


// Handle request for user uploaded files
// DEPRECATED: use /_/file/:fileId
app.get('/_/image/:fileId', async (request, response) => {
  const fileId = request.params.fileId;
  console.warn(`DEPRECATED: use /_/file/${fileId}`);
  console.log(`GET ${request.url} (fileId: ${fileId})`);
  console.log(`URL query parameters: ${JSON.stringify(request.query, null, 2)}`);

  const userFile: TanamFile = await fileService.getUserFile(fileId);
  if (!userFile) {
    console.log(`[HTTP 404] No such file: ${request.url}`);
    response.status(404).send(`Not found: ${request.url}`);
    return;
  }

  const storagePath = userFile.variants[request.query.s || request.query.size] || userFile.filePath;
  response.setHeader('Cache-Control', `public, max-age=604800, s-maxage=31536000, stale-while-revalidate=600`);
  response.setHeader('Content-Type', fileService.getContentTypeFromPath(storagePath));
  response.send(await fileService.getFileContents(storagePath));
  return null;
});

// Handle request for user uploaded files
app.get('/_/file/:fileId', async (request, response) => {
  const fileId = request.params.fileId;
  console.log(`GET ${request.url} (fileId: ${fileId})`);
  console.log(`URL query parameters: ${JSON.stringify(request.query, null, 2)}`);

  const userFile: TanamFile = await fileService.getUserFile(fileId);
  if (!userFile) {
    console.log(`[HTTP 404] No such file: ${request.url}`);
    response.status(404).send(`Not found: ${request.url}`);
    return;
  }

  const storagePath = userFile.variants[request.query.s || request.query.size] || userFile.filePath;
  response.setHeader('Cache-Control', `public, max-age=604800, s-maxage=31536000, stale-while-revalidate=600`);
  response.setHeader('Content-Type', fileService.getContentTypeFromPath(storagePath));
  response.send(await fileService.getFileContents(storagePath));
  return null;
});

// Handle request for user uploaded files
app.get(/^\/?_\/theme\/(.*)$/, async (request, response) => {
  console.log(`[theme handler] GET ${request.url}`);
  const match = request.url.match(/\/?_\/theme\/(.*)$/);
  const filePath = match[1];
  if (!filePath) {
    console.error(`Could not match a file path for URL: ${request.url}`);
    response.status(500).send(`Could not handle request: ${request.url}`);
    return null;
  }

  const themeAssetFile: TanamFile = await fileService.geThemeAssetsFile(filePath);
  if (!themeAssetFile) {
    console.log(`[HTTP 404] No media file: ${request.url}`);
    response.status(404).send(`Not found: ${request.url}`);
    return;
  }

  response.setHeader('Content-Type', fileService.getContentTypeFromPath(filePath));
  response.setHeader('Cache-Control', `public, max-age=604800, s-maxage=31536000, stale-while-revalidate=600`);
  response.send(await fileService.getFileContents(themeAssetFile.filePath));
  return null;
});

app.get('/manifest.json', (request, response) => {
  response.status(404).send('Not implemented yet');
});

app.get('/sitemap.xml', async (request, response) => {
  const sitemap = await fileService.getSitemap();
  response.setHeader('Cache-Control', getCacheHeader());
  response.send(sitemap);
  return null;
});

app.get('/robots.txt', (request, response) => {
  const robotsDefinition = ['User-agent: *', 'Disallow: /_/'];
  response.send(robotsDefinition.join('\n'));
});

app.get('/favicon.ico', async (request, response) => {
  response.setHeader('Content-Type', 'image/ico');
  response.setHeader('Cache-Control', getCacheHeader());

  const favicon = await fileService.getFavicon();
  if (favicon) {
    response.send(favicon);
    return null;
  }

  response.status(404).send();
  return null;
});

app.get('*', async (request, response) => {
  const tanamHttpRequest = TanamHttpRequest.fromExpressRequest(request);
  console.log(JSON.stringify(tanamHttpRequest));
  console.log(`GET ${tanamHttpRequest.url}`);

  const context = await getPageContextByUrl(tanamHttpRequest.url);
  if (!context) {
    response.status(404);
    console.log(`[HTTP 404] page not found for: ${tanamHttpRequest}`);
    try {
      const html404 = await renderPage404();
      return response.send(html404);
    } catch (error) {
      return response.send(`Not found: ${tanamHttpRequest.fullyQualifiedUrl}`)
    }
  }

  const html = await renderPage(context);
  if (!html) {
    console.error(`[HTTP 500] could not create template for: ${tanamHttpRequest.url}`);
    return response.status(500).send('Could not create HTML template document');
  }

  response.setHeader('Cache-Control', getCacheHeader());
  response.send(html);
  return null;
});
