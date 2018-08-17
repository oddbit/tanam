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

export function heatCache(host: string, path: string) {
    console.log(`Heating cache: ${host}${path}`);
    const opts = {
        hostname: host,
        port: 443,
        path: path,
        method: 'GET'
    };

    return new Promise((resolve, _) => {
        https.get(opts, resolve);
    });
}