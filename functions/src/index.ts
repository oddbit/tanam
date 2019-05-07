
import { MD5 } from 'crypto-js';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as fs from 'fs';
import { join } from 'path';
import { renderPage } from './render';
import * as configService from './services/config.service';
import { getPageContextByUrl } from './services/page-context.service';
import * as fileService from './services/file.service';

const DIST_FOLDER = join(process.cwd(), 'browser');
const TANAM_FOLDER = join(process.cwd(), 'node_modules', 'tanam', 'browser');

if (admin.apps.length === 0) {
    admin.initializeApp();
}

admin.firestore().settings({ timestampsInSnapshots: true });

export * from './triggers';

const app = express();
export const tanam = functions.https.onRequest(app);

const CACHE_CONFIG = {
    s_max_age: 60 * 5, // 60 * 60 * 24,
    max_age: 60 * 10
};

export const initializeApp = configService.setConfig;

/**
 * Get a cache header string that can be set in a HTTP response header.
 */
export function getCacheHeader(): string {
    const funcionsConf = functions.config().cache;
    if (funcionsConf) {
        CACHE_CONFIG.max_age = funcionsConf.max_age || CACHE_CONFIG.max_age;
        CACHE_CONFIG.s_max_age = funcionsConf.s_max_age || CACHE_CONFIG.s_max_age;
    }

    console.log(`[getCacheHeader] Get cache header configuration: ${JSON.stringify(CACHE_CONFIG)}`);
    return `public, max-age=${CACHE_CONFIG.max_age}, s-maxage=${CACHE_CONFIG.s_max_age}, stale-while-revalidate=120`;
}


async function _getDistFolder() {
    return new Promise<string>((resolve) => {
        fs.exists(TANAM_FOLDER, exists => {
            const folder = exists ? TANAM_FOLDER : DIST_FOLDER;
            console.log(`[_getDistFolder]: ${folder}`);
            resolve(folder);
        });
    });
}

async function _registerHostname(request) {
    const domainsRef = admin.database().ref('tanam')
        .child(process.env.GCLOUD_PROJECT)
        .child('domains');

    const defaultDomain = `${process.env.GCLOUD_PROJECT}.firebaseapp.com`;
    const promises = [domainsRef.child(MD5(defaultDomain).toString()).set(defaultDomain)];

    // Save "known" domains upon request to resources that are likely to seldom change -> cached for long
    // So that the overhead is done as seldom as possible
    const hostname = request.hostname;
    if (hostname !== 'localhost' && !hostname.endsWith(`.cloudfunctions.net`)) {
        console.log(`[_registerHostname] Saving hostname: ${hostname}`);
        promises.push(domainsRef.child(MD5(hostname).toString()).set(hostname));
    }

    return Promise.all(promises);
}

// Match the Angular generated files with the unique hash
// Serve them with fairly long cache lifetime since they'll be unique for each deploy
app.get(/^\/?main|polyfills|runtime|styles|vendor\.[\w\d]{20}\.js|css\/?$/i, async (request, response) => {
    const requestUrl = request.url.split('/');
    const distFolder = await _getDistFolder();
    response.setHeader('Cache-Control', `public, max-age=600, s-maxage=8640000, stale-while-revalidate=120`);
    response.sendFile(join(distFolder, ...requestUrl));
    return null;
});

// Handle Angular app's assets
app.get(/^\/?assets\/(.*)\/?$/i, async (request, response) => {
    console.log(`[express.assets] ${request.url}`);

    response.setHeader('Cache-Control', `public, max-age=600, s-maxage=3600, stale-while-revalidate=120`);

    if (request.url.match(/^\/?assets\/tanam\.config\.json$/i)) {
        const tanamConfig = configService.getPublicConfig();
        console.log(`[express.assets] ${JSON.stringify({ tanamConfig })}`);
        response.json(tanamConfig);
        return null;
    }

    const requestUrl = request.url.split('/');
    const distFolder = await _getDistFolder();
    response.sendFile(join(distFolder, ...requestUrl));
    return null;
});

// Handle request for user uploaded files
app.get('/_/image/:fileId', async (request, response) => {
    const fileId = request.params.fileId;
    console.log(`GET ${request.url} (fileId: ${fileId})`);
    console.log(`URL query parameters: ${JSON.stringify(request.query, null, 2)}`);

    const fileContents = await fileService.getImageFile(fileId, request.query.s);
    if (!fileContents) {
        console.log(`[HTTP 404] No media file: ${request.url}`);
        response.status(404).send(`Not found: ${request.url}`);
        return;
    }

    response.setHeader('Cache-Control', getCacheHeader());
    response.send(fileContents);
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

    const fileContents = await fileService.getThemeAssetsFile(filePath);
    if (!fileContents) {
        console.log(`[HTTP 404] No media file: ${request.url}`);
        response.status(404).send(`Not found: ${request.url}`);
        return;
    }

    response.setHeader('Content-Type', fileService.getContentTypeFromPath(filePath));
    response.setHeader('Cache-Control', getCacheHeader());
    response.send(fileContents);
    return null;
});

// Any other "underscore path" -> serve tanam Angular Admin App
app.get(/^\/?_\/(.*)\/?$/i, async (request, response) => {
    const distFolder = await _getDistFolder();
    response.setHeader('Cache-Control', `public, max-age=600, s-maxage=3600, stale-while-revalidate=120`);

    response.sendFile(join(distFolder, 'admin.html'));
    return _registerHostname(request);
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

    const distFolder = await _getDistFolder();
    response.sendFile(join(distFolder, 'favicon.ico'));
    return null;
});

app.get('*', async (request, response) => {
    console.log(`GET ${request.url}`);
    const url = request.url.replace(/^\//, ''); // Remove leading slash

    const context = await getPageContextByUrl(url);
    if (!context) {
        console.log(`[HTTP 404] page not found for: ${request.url}`);
        return response.status(404).send(`Not found: ${request.url}`);
    }

    const html = await renderPage(context);
    if (!html) {
        console.error(`[HTTP 500] could not create template for: ${request.url}`);
        return response.status(500).send('Could not create HTML template document');
    }

    response.setHeader('Cache-Control', getCacheHeader());
    response.send(html);
    return _registerHostname(request);
});
