import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as https from 'https';
import * as site from './site';
import * as content from './content';
import { SHA256 } from 'crypto-js';
import * as contentTypes from './contentTypes';

interface CacheConfig {
  max_age: number;    // Time in seconds to keep cache on CDN
  s_max_age: number;  // Time in seconds to keep cache in browser
}

interface CachedDomain {
  domain: string;     // A domain that Tanam has received request on
  lastSeen: number;  // Timestamp when it was last requested
}

const CONFIG_DEFAULT: CacheConfig = {
  s_max_age: 60 * 60 * 24,
  max_age: 60 * 10
};

abstract class CacheFirebasePath {
  static readonly hostRegistry = 'cacheDomains';
}

/**
 * Get a cache header string that can be set in a HTTP response header.
 */
export function getCacheHeader(): string {
  const config = { ...CONFIG_DEFAULT, ...(functions.config().cache || {}) };
  console.log(`[getCacheHeader] Get cache header configuration: ${JSON.stringify(config)}`);
  return `public, max-age=${config.max_age}, s-maxage=${config.s_max_age}`;
}

/**
 * Trigger on any change to a Firestore document: purge and heat cache
 *
 */
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
    return heatCache(docAfterChange.path[0]);
  }

  return null;
});

/**
 * Clear all pages and theme files from cache when changing theme. After that, heat up all pages.
 *
 */
export const tanam_onThemeChangeUpdateCache = functions.database.ref(site.SiteFirebasePath.themeName).onWrite(async (snap, context) => {
  if (!snap.before.exists()) {
    console.log('Nothing to do when setting theme for the first time.');
    return null;
  }

  const currentTheme = snap.after.val();
  const previousTheme = snap.before.val();
  console.log(`Changing theme from "${previousTheme}" => "${currentTheme}"`);

  await Promise.all([
    purgeAllThemeFileCache(previousTheme),
    purgeAllPageCache(),
  ]);

  return heatAllPageCache();
});

/**
 * Whenever a cloud storage file is uploaded it will trigger an update of CDN cache. Assets will just purge the asset
 * itself from cache, but template changes will require the whole site cache to be purged.
 *
 */
export const tanam_onFileFinalizedUpdateCache = functions.storage.object().onFinalize(async (object) => {
  console.log(`File updated: ${object.name}.`);
  const filePath = content.getPublicPathToStorageFile(object.name);
  if (contentTypes.getContentType(filePath) === 'text/template') {
    console.log(`Template was updated. Purge all cache to refresh site.`);
    await purgeAllPageCache();
    return heatAllPageCache();
  }

  console.log(`Updating cache for file=${filePath}.`);
  await purgeCache(filePath);
  return heatCache(filePath);
});


/**
 * Whenever a cloud storage file is removed it will trigger an update of CDN cache. Assets will just purge the asset
 * itself from cache, but template changes will require the whole site cache to be purged.
 *
 */
export const tanam_onFileDeleteUpdateCache = functions.storage.object().onDelete(async (object) => {
  console.log(`File deleted: ${object.name}.`);
  const filePath = content.getPublicPathToStorageFile(object.name);
  if (contentTypes.getContentType(filePath) === 'text/template') {
    console.log(`Template was deleted. Purge all cache to refresh site.`);
    await purgeAllPageCache();
    return heatAllPageCache();
  }

  return purgeCache(filePath);
});

/**
 * Register the domain of a web request to Tanam. This lets the system know which domains that we might have
 * cached content on, so that it can be properly purged later.
 *
 */
export function registerRequestHost(host: string) {
  const promises = [];
  const hosts = [host];
  if (host.endsWith('.cloudfunctions.net')) {
    // Reqeusts to the firebaseapp.com domain resolves to the cloud functions domain. So register both.
    hosts.push(site.getDefaultDomain());
  }

  for (const currentHost of hosts) {
    console.log(`[registerRequest] Register request host=${currentHost}`);
    const hostHash = SHA256(currentHost).toString().toLowerCase();
    const cachedDomainData: CachedDomain = {
      domain: currentHost,
      lastSeen: admin.database.ServerValue.TIMESTAMP
    };

    promises.push(admin.database().ref(CacheFirebasePath.hostRegistry).child(hostHash).set(cachedDomainData));
  }

  return Promise.all(promises);
}

/**
 * Purge cache for all theme files.
 *
 * @param theme Name of the theme
 */
async function purgeAllThemeFileCache(theme: string) {
  const promises = [];
  const files = await content.getThemeFiles(theme);
  for (const file of files) {
    const filePath = content.getPublicPathToStorageFile(file.name);
    promises.push(purgeCache(filePath));
  }

  return Promise.all(promises);
}

/**
 * Purge cache for all pages.
 */
async function purgeAllPageCache() {
  const promises = [];
  const documents = await content.getAllDocuments();
  for (const document of documents) {
    const contentDocument = document.data() as content.ContentDocument;
    promises.push(purgeCache(contentDocument.path[0]));
  }

  return Promise.all(promises);
}

/**
 * Heat up cache for all pages.
 */
async function heatAllPageCache() {
  const promises = [];
  const documents = await content.getAllDocuments();
  for (const document of documents) {
    const contentDocument = document.data() as content.ContentDocument;
    promises.push(heatCache(contentDocument.path[0]));
  }

  return Promise.all(promises);
}

/**
 * Purge cache for one specific page
 */
async function purgeCache(filePath: string) {
  const promises = [];
  const filenameVariants = [filePath];
  if (filePath.endsWith('/index.html')) {
    filenameVariants.push(filePath.substr(0, filePath.lastIndexOf('/index.html')));
    filenameVariants.push(filePath.substr(0, filePath.lastIndexOf('index.html')));
  }

  const snap = await admin.database().ref(CacheFirebasePath.hostRegistry).once('value');
  snap.forEach(childSnap => {
    const hostData = childSnap.val();
    for (const filenameVariant of filenameVariants) {
      promises.push(purgeFromCdn(hostData.domain, filenameVariant));
    }
    return false;
  });

  return Promise.all(promises);
}

/**
 * Heat up cache for one specific page
 */
async function heatCache(filePath: string, delay: number = 5000) {
  console.log(`[heatCache] filePath=${filePath}, delay=${delay / 1000} seconds.`);
  await new Promise((resolve) => setTimeout(resolve, delay)); // Sleep for a while before heating cache

  const promises = [];
  const filenameVariants = [filePath];
  if (filePath.endsWith('/index.html')) {
    filenameVariants.push(filePath.substr(0, filePath.lastIndexOf('/index.html')));
    filenameVariants.push(filePath.substr(0, filePath.lastIndexOf('index.html')));
  }

  const snap = await admin.database().ref(CacheFirebasePath.hostRegistry).once('value');
  snap.forEach(childSnap => {
    const hostData = childSnap.val() as CachedDomain;
    for (const filenameVariant of filenameVariants) {
      promises.push(heatUpCdn(hostData.domain, filenameVariant));
    }
    return false;
  });

  return Promise.all(promises);
}

/**
 * Send a request to CDN to purge one specific page
 */
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

/**
 * Send a request to our selves for one specific page, that will in turn heat up the CDN cache
 */
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
