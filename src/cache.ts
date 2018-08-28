import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as https from 'https';
import * as site from './site';
import * as content from './content';
import { SHA256 } from 'crypto-js';

interface CacheConfig {
  max_age: number;    // Time in seconds to keep cache on CDN
  s_max_age: number;  // Time in seconds to keep cache in browser
}

const CONFIG_DEFAULT: CacheConfig = {
  s_max_age: 60 * 60 * 24 * 365,
  max_age: 60 * 10
};

abstract class CacheFirebasePath {
  static readonly pathRegistry = 'cache';
}

export function getCacheHeader(): string {
  const config = { ...CONFIG_DEFAULT, ...(functions.config().cache || {}) };
  console.log(`[getCacheHeader] Get cache header configuration: ${JSON.stringify(config)}`);
  return `public, max-age=${config.max_age}, s-maxage=${config.s_max_age}`;
}

export const tanam_onDocWriteUpdateCache = functions.firestore.document('/{type}/{documentId}').onWrite(async (snap, context) => {
  console.log(`${context.eventType} ${context.params.type}/${context.params.documentId}`);
  const docBeforeChange = snap.before.data();

  const domain = await site.getPrimaryDomain();
  console.log(`[getCacheHeader] Site domain: ${domain}`);
  if (snap.before.exists && !!docBeforeChange.path) {
    await Promise.all([
      // Sitemap will only be purged, not heated. Let it lazily be triggered by crawlers.
      purgeCache('/sitemap.xml'),
      
      purgeCache(docBeforeChange.path[0])
    ]);
  }

  const docAfterChange = snap.after.data();
  if (snap.after.exists && !!docAfterChange.path) {
    return heatCache(domain, docAfterChange.path[0]);
  }

  return null;
});

export const tanam_onThemeChangeUpdateCache = functions.database.ref(site.SiteFirebasePath.themeName).onWrite(async (snap, context) => {
  if (!snap.before.exists()) {
    console.log('Nothing to do when setting theme for the first time.');
    return null;
  }

  const domains = await site.getDomains();
  const previousTheme = snap.before.val();

  console.log(`Clearing cache for theme assets: ${previousTheme}`);
  const themeFiles = await content.getThemeFiles(previousTheme);
  const documents = await content.getAllDocuments();

  const promises = [];
  for (const domain of domains) {
    console.log(`Clearing all caches for ${domain}.`);

    for (const themeFile of themeFiles) {
      promises.push(purgeCache(content.getPublicPathToStorageFile(themeFile.name)));
    }

    for (const document of documents) {
      promises.push(purgeCache(document.data().path[0]));
    }
  }

  return Promise.all(promises);
});

export const tanam_onFileChangeUpdateCache = functions.storage.object().onFinalize(async (object) => {
  console.log(`File updated: ${object.name}.`);
  const filePath = content.getPublicPathToStorageFile(object.name);

  const promises = [];
  const domains = await site.getDomains();
  for (const domain of domains) {
    console.log(`Updating cache for file=${filePath}, domain=${domain}.`);
    await purgeCache(filePath);
    promises.push(heatCache(domain, filePath));
  }

  return Promise.all(promises);
});

export const tanam_onFileDeleteUpdateCache = functions.storage.object().onDelete(async (object) => {
  console.log(`File deleted: ${object.name}.`);
  const filePath = content.getPublicPathToStorageFile(object.name);

  const promises = [];
  const domains = await site.getDomains();
  for (const domain of domains) {
    console.log(`Removing cache for file=${filePath}, domain=${domain}.`);
    promises.push(purgeCache(filePath));
  }

  return Promise.all(promises);
});

export function registerRequest(host: string, filePath: string) {
  const promises = [];
  const hosts = [host];

  if (host.endsWith('.cloudfunctions.net')) {
    // Reqeusts to the firebaseapp.com domain resolves to the cloud functions domain. So register both.
    hosts.push(site.getDefaultDomain());
  }

  for (const currentHost of hosts) {
    console.log(`[registerRequest] Register request host=${currentHost}, filePath=${filePath}`);
    const fileHash = SHA256(filePath).toString().toLowerCase();
    const hostHash = SHA256(currentHost).toString().toLowerCase();
    promises.push(admin.database().ref(CacheFirebasePath.pathRegistry).child(fileHash).child(hostHash).set(currentHost));
  }

  return Promise.all(promises);
}

async function heatCache(host: string, filePath: string, delay: number = 10000) {
  console.log(`[heatCache] host=${host}, filePath=${filePath}, delay=${delay / 1000} seconds.`);
  await new Promise((resolve) => setTimeout(resolve, delay)); // Sleep for a while before heating cache
  return heatUpCdn(host, filePath);
}

async function purgeCache(filePath: string) {
  const promises = [];
  const fileHash = SHA256(filePath).toString().toLowerCase();
  const snap = await admin.database().ref(CacheFirebasePath.pathRegistry).child(fileHash).once('value');
  snap.forEach(childSnap => {
    const cachedHost = childSnap.val();
    promises.push(childSnap.ref.remove());
    promises.push(purgeFromCdn(cachedHost, filePath));
    return false;
  });

  return Promise.all(promises);
}

function purgeFromCdn(host: string, path: string) {
  console.log(`[purgeFromCdn] ${host}${path}`);
  const opts = {
    hostname: host,
    port: 443,
    path: path,
    method: 'PURGE'
  };

  return new Promise((resolve) => {
    https.get(opts, (res) => {
      console.log(`[purgeFromCdn] Finished request: ${res.statusCode} ${res.statusMessage}`);
      resolve(null);
    });
  });
}

function heatUpCdn(host: string, path: string) {
  console.log(`[heatUpCdn] ${host}${path}`);
  const opts = {
    hostname: host,
    port: 443,
    path: path,
    method: 'GET'
  };

  return new Promise((resolve) => {
    https.get(opts, (res) => {
      console.log(`[heatUpCdn] Finished request: ${res.statusCode} ${res.statusMessage}`);
      resolve(null);
    });
  });
}
