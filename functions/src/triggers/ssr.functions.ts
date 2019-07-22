import * as express from 'express';
import * as functions from 'firebase-functions';
import { TANAM_BROWSER_CACHE_SECONDS, TANAM_SERVER_CACHE_SECONDS } from '../definitions/cache.constants';
import { TanamFile } from '../models';
import { TanamHttpRequest } from '../models/http_request.model';
import * as fileService from '../services/file.service';
import { getPageContextForRequest } from '../services/page-context.service';
import * as render from '../render';

const app = express();
export const tanam = functions.https.onRequest(app);

/**
 * Get a cache header string that can be set in a HTTP response header.
 */
export function getCacheHeader(request: TanamHttpRequest): string {
  if (!!request.hostname.match(/^localhost(:\d+)?$/)) {
    console.log('[getCacheHeader] Skip cache on localhost.');
    return `no-cache`;
  }

  const functionsConf = functions.config().cache || {};
  const maxAge = functionsConf.max_age || TANAM_BROWSER_CACHE_SECONDS;
  const sMaxAge = functionsConf.s_max_age || TANAM_SERVER_CACHE_SECONDS;

  console.log(`[getCacheHeader] ${JSON.stringify({ maxAge, sMaxAge })}`);
  return `public, max-age=${maxAge}, s-maxage=${sMaxAge}, stale-while-revalidate=120`;
}


// Handle request for user uploaded files
// DEPRECATED: use /_/file/:fileId
app.get('/_/image/:fileId', async (request, response) => {
  const tanamHttpRequest = TanamHttpRequest.fromExpressRequest(request);
  console.log(JSON.stringify(tanamHttpRequest));
  const fileId = request.params.fileId;
  console.warn(`DEPRECATED: use /_/file/${fileId}`);
  console.log(`GET ${request.url} (fileId: ${fileId})`);
  console.log(`URL query parameters: ${JSON.stringify(tanamHttpRequest.query)}`);

  const userFile: TanamFile = await fileService.getUserFile(tanamHttpRequest, fileId);
  if (!userFile) {
    console.log(`[HTTP 404] No such file: ${tanamHttpRequest.toString()}`);
    response.status(404).send(`Not found: ${tanamHttpRequest.url}`);
    return;
  }

  const storagePath = userFile.variants[tanamHttpRequest.query.s || tanamHttpRequest.query.size] || userFile.filePath;
  response.setHeader('Cache-Control', getCacheHeader(tanamHttpRequest));
  response.setHeader('Content-Type', fileService.getContentTypeFromPath(storagePath));
  response.send(await fileService.getFileContents(storagePath));
  return null;
});

// Handle request for user uploaded files
app.get('/_/file/:fileId', async (request, response) => {
  const tanamHttpRequest = TanamHttpRequest.fromExpressRequest(request);
  console.log(JSON.stringify(tanamHttpRequest));
  const fileId = request.params.fileId;
  console.log(`GET ${tanamHttpRequest.toString()} (fileId: ${fileId})`);
  console.log(`URL query parameters: ${JSON.stringify(tanamHttpRequest.query)}`);

  const userFile: TanamFile = await fileService.getUserFile(tanamHttpRequest, fileId);
  if (!userFile) {
    console.log(`[HTTP 404] No such file: ${tanamHttpRequest.toString()}`);
    response.status(404).send(`Not found: ${tanamHttpRequest.url}`);
    return;
  }

  const storagePath = userFile.variants[tanamHttpRequest.query.s || tanamHttpRequest.query.size] || userFile.filePath;
  response.setHeader('Cache-Control', getCacheHeader(tanamHttpRequest));
  response.setHeader('Content-Type', fileService.getContentTypeFromPath(storagePath));
  response.send(await fileService.getFileContents(storagePath));
  return null;
});

// Handle request for user uploaded files
app.get(/^\/?_\/theme\/(.*)$/, async (request, response) => {
  const tanamHttpRequest = TanamHttpRequest.fromExpressRequest(request);
  console.log(JSON.stringify(tanamHttpRequest));
  console.log(`[theme handler] GET ${tanamHttpRequest.toString()}`);
  const match = request.url.match(/\/?_\/theme\/(.*)$/);
  const filePath = match[1];
  if (!filePath) {
    console.error(`Could not match a file path for URL: ${tanamHttpRequest.toString()}`);
    response.status(500).send(`Could not handle request: ${tanamHttpRequest.url}`);
    return null;
  }

  const themeAssetFile: TanamFile = await fileService.geThemeAssetsFile(tanamHttpRequest, filePath);
  if (!themeAssetFile) {
    console.log(`[HTTP 404] No media file: ${tanamHttpRequest.toString()}`);
    response.status(404).send(`Not found: ${tanamHttpRequest.url}`);
    return;
  }

  response.setHeader('Content-Type', fileService.getContentTypeFromPath(filePath));
  response.setHeader('Cache-Control', getCacheHeader(tanamHttpRequest));
  response.send(await fileService.getFileContents(themeAssetFile.filePath));
  return null;
});

app.get('/manifest.json', (request, response) => {
  response.status(404).send('Not implemented yet');
});

app.get('/sitemap.xml', async (request, response) => {
  const tanamHttpRequest = TanamHttpRequest.fromExpressRequest(request);
  console.log(JSON.stringify(tanamHttpRequest));
  const siteMap = await fileService.getSitemap(tanamHttpRequest);
  response.setHeader('Cache-Control', getCacheHeader(tanamHttpRequest));
  response.send(siteMap);
  return null;
});

app.get('/robots.txt', (request, response) => {
  const robotsDefinition = ['User-agent: *', 'Disallow: /_/'];
  response.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=500, stale-while-revalidate=120');
  response.send(robotsDefinition.join('\n'));
});

app.get('/favicon.ico', async (request, response) => {
  const tanamHttpRequest = TanamHttpRequest.fromExpressRequest(request);
  console.log(JSON.stringify(tanamHttpRequest));
  response.setHeader('Content-Type', 'image/ico');
  response.setHeader('Cache-Control', getCacheHeader(tanamHttpRequest));

  const favicon = await fileService.getFavicon();
  if (favicon) {
    response.send(favicon);
    return null;
  }

  response.setHeader('Cache-Control', 'no-cache');
  response.status(404).send(null);
  return null;
});

app.get('*', async (request, response) => {
  const tanamHttpRequest = TanamHttpRequest.fromExpressRequest(request);
  console.log(JSON.stringify(tanamHttpRequest));
  console.log(`GET ${tanamHttpRequest.toString()}`);

  const context = await getPageContextForRequest(tanamHttpRequest);
  if (!context) {
    console.log(`[HTTP 404] page not found for: ${tanamHttpRequest.toString()}`);
    const html404 = await render.renderErrorPage(tanamHttpRequest, 'http404');
    response.setHeader('Cache-Control', 'no-cache');
    return response.status(404).send(html404);
  }

  const html = await render.renderPage(context);
  if (!html) {
    console.error(`[HTTP 500] could not create template for: ${tanamHttpRequest.url}`);
    response.setHeader('Cache-Control', 'no-cache');
    return response.status(500).send('Could not create HTML template document');
  }

  response.setHeader('Cache-Control', getCacheHeader(tanamHttpRequest));
  response.send(html);
  return null;
});
