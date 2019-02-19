
import { MD5 } from 'crypto-js';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { join } from 'path';
import { TanamConfig } from '../../models';
import * as fileService from './services/file.service';
import { getDocumentContextByUrl } from './services/document-context.service';
import { renderDocument } from './render';

const DIST_FOLDER = join(process.cwd(), 'browser');

admin.initializeApp();
admin.firestore().settings({ timestampsInSnapshots: true });

export * from './triggers';

const app = express();
export const tanam = functions.https.onRequest(app);

const CACHE_CONFIG = {
    s_max_age: 60 * 5, // 60 * 60 * 24,
    max_age: 60 * 10
};

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

export function initializeApp(tanamConfig: TanamConfig) {
    app.get('/assets/tanam.config.json', (req: express.Request, res: express.Response) => {
        console.log(`[GET] /assets/tanam.config.json => ${JSON.stringify(tanamConfig, null, 2)}`);
        res.set('Cache-Control', getCacheHeader());
        res.json(tanamConfig);
    });
}

// Match the Angular generated files with the unique hash
// Serve them with fairly long cache lifetime since they'll be unique for each deploy
app.get(/^\/?main|polyfills|runtime|styles|vendor\.[\w\d]{20}\.js|css\/?$/i,
    express.static(DIST_FOLDER, {
        setHeaders: (res, path) => res.set('Cache-Control', getCacheHeader()),
    }),
);

// Handle Angular app's assets
app.get(/^\/?assets\/(.*)\/?$/i,
    express.static(DIST_FOLDER, {
        setHeaders: (res, path) => res.set('Cache-Control', getCacheHeader()),
    }),
);

// Handle request for user uploaded files
app.get('/_/image/:fileId', async (request, response) => {
    const fileId = request.params.fileId;
    console.log(`GET ${request.url} (fileId: ${fileId})`);
    console.log(`QUERY: ${JSON.stringify(request.query, null, 2)}`);

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

// Any other "underscore path" -> serve tanam Angular Admin App
app.get(/^\/?_\/(.*)\/?$/i, (request, response) => {
    console.log(`DIST FOLDER: ${DIST_FOLDER}`);
    console.log(`WORK DIR: ${process.cwd()}`);

    response.setHeader('Cache-Control', getCacheHeader());
    response.sendFile(join(DIST_FOLDER, 'admin.html'));
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
    } else {
        response.sendFile(join(DIST_FOLDER, 'favicon.ico'));
    }

    // Save "known" domains upon request to resources that are likely to seldom change -> cached for long
    // So that the overhead is done as seldom as possible
    return admin.database().ref('tanam')
        .child(process.env.GCLOUD_PROJECT)
        .child('domains')
        .child(MD5(request.hostname).toString())
        .set(request.hostname);
});

app.get('*', async (request, response) => {
    console.log(`GET ${request.url}`);
    const url = request.url.replace(/^\//, ''); // Remove leading slash

    const context = await getDocumentContextByUrl(url);
    if (!context) {
        console.log(`[HTTP 404] page not found for: ${request.url}`);
        response.status(404).send(`Not found: ${request.url}`);
        return;
    }

    const html = await renderDocument(context);
    response.setHeader('Cache-Control', getCacheHeader());
    response.send(html);
    return null;
});
