import * as https from 'https';

export function purgeCache(host: string, path: string) {
    console.log(`Purging cache: ${host}${path}`);
    const opts = {
        hostname: host,
        port: 443,
        path: path,
        method: 'PURGE'
    };

    return new Promise((resolve, _) => {
        https.request(opts, resolve);
    });
}