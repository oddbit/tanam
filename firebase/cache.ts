import * as functions from 'firebase-functions';
import * as https from 'https';

interface CacheTask {
    action: 'create' | 'update' |'delete';
    domain: string;
    url: string;
}

export const cacheTask = functions.database.ref('tanam/tasks/cache/{taskId}').onCreate(async (snap, context) => {
    const task = snap.val() as CacheTask;

    const promises: Promise<any>[] = [snap.ref.remove()];

    switch (task.action) {
        case 'delete':
            promises.push(purgeCacheFromCdn(task.domain, task.url));
        break;

        case 'create':
            promises.push(createCacheOnCdn(task.domain, task.url));
        break;

        case 'update':
        default:
            await purgeCacheFromCdn(task.domain, task.url);
            promises.push(createCacheOnCdn(task.domain, task.url));
    }

    return promises;
});


/**
 * Send a request to CDN to purge one specific page
 */
function purgeCacheFromCdn(host: string, path: string) {
    console.log(`[purgeCacheFromCdn] ${host}${path}`);
    const opts = {
        hostname: host,
        port: 443,
        path: path,
        method: 'PURGE'
    };

    return new Promise((resolve) => {
        https.get(opts, (res) => {
            console.log(`[purgeCacheFromCdn] Finished request: ${res.statusCode} ${res.statusMessage}`);
            resolve(null);
        });
    });
}

/**
 * Send a request to our selves for one specific page, that will in turn heat up the CDN cache
 */
function createCacheOnCdn(host: string, path: string) {
    console.log(`[createCacheOnCdn] ${host}${path}`);
    const opts = {
        hostname: host,
        port: 443,
        path: path,
        method: 'GET'
    };

    return new Promise((resolve) => {
        https.get(opts, (res) => {
            console.log(`[createCacheOnCdn] Finished request: ${res.statusCode} ${res.statusMessage}`);
            resolve(null);
        });
    });
}
