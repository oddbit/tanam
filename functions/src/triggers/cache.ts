import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as https from 'https';
import { SiteInformation } from '../models';

/**
 * Send a request to either purge or heat the CDN
 *
 * For `GET` requests, this function will pre-heat the CDN cache by trying to request the updated document
 * before any visitor is hitting it. It's a race condition agains visitors to try and beat them to be the
 * first to trigger a new render. The hope is that this function will be the only client that is exposed to
 * the relativly slow operation of rendering a document. Any subsequest client request will get a static
 * version from the CDN cache.
 *
 * The `PURGE` action removes the previously cached document at given URL. This allows for the next `GET`
 * request to get a freshly rendered document that accurately represents the current content.
 *
 * @param action PURGE | GET
 * @param host Domain host (e.g. somesubdomain.example.com)
 * @param path Path part of the URL
 */
function _makeRequest(action: 'PURGE' | 'GET', host: string, path: string) {
    const normalizedPath = path.replace(/\/+/g, '/');
    const opts = {
        hostname: host,
        port: 443,
        path: normalizedPath,
        method: action,
    };

    console.log(`[makeRequest] BEGIN ${JSON.stringify(opts)}`);
    return new Promise((resolve) => {
        https.get(opts, (res) => {
            console.log(`[makeRequest] FINISHED ${JSON.stringify({ ...opts, statusCode: res.statusCode, statusMessage: res.statusMessage })}`);
            resolve(null);
        });
    });
}

export const handleCacheTask = functions.database.ref('tanam/{siteId}/tasks/cache/{action}/{taskId}').onCreate(async (snap, context) => {
    const siteId = context.params.siteId;
    const action = context.params.action;
    const url = snap.val() as string;
    console.log(`${JSON.stringify({ action, url })}`);

    const promises: Promise<any>[] = [snap.ref.remove()];

    const siteInfoDoc = await admin.firestore().collection('tanam').doc(siteId).get();
    const siteInfo = siteInfoDoc.data() as SiteInformation;

    if (action === 'update') {
        console.log(`Purge cache and wait for all to finish: ${JSON.stringify(siteInfo.domains)}`);
        await Promise.all(siteInfo.domains.map(domain => _makeRequest('PURGE', domain, url)));
    }

    if (action === 'create' && action === 'update') {
        console.log(`Create cache: ${JSON.stringify(siteInfo.domains)}`);
        siteInfo.domains.forEach(domain => promises.push(_makeRequest('GET', domain, url)));
    }

    if (action === 'delete') {
        console.log(`Purge cache: ${JSON.stringify(siteInfo.domains)}`);
        siteInfo.domains.forEach(domain => promises.push(_makeRequest('PURGE', domain, url)));
    }

    return promises;
});
