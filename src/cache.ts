import * as functions from 'firebase-functions';
import * as https from 'https';
import * as site from './site';
import * as content from './content';

export type TanamCacheType = 'purgeable' | 'stylesheet' | 'javascript' | 'image';

interface CacheConfig {
  max_age: number;    // Time in seconds to keep cache on CDN
  s_max_age: number;  // Time in seconds to keep cache in browser
}

const CONFIG_DEFAULT: { [key: string]: CacheConfig; } = {
  'purgeable': {
    s_max_age: 60 * 60 * 24 * 365,
    max_age: 60 * 10
  },
  'stylesheet': {
    s_max_age: 60 * 60 * 24,
    max_age: 60 * 10
  },
  'javascript': {
    s_max_age: 60 * 60 * 24,
    max_age: 60 * 10
  },
  'image': {
    s_max_age: 60 * 60 * 24,
    max_age: 60 * 10
  }
};

export function getCacheHeader(type: TanamCacheType): string {
  const config = { ...CONFIG_DEFAULT, ...(functions.config().cache || {}) };
  const typeConfig = config[type] as CacheConfig;
  console.log(`[getCacheHeader] Get cache header ${type} configuration: ${JSON.stringify(typeConfig)}`);
  return `public, max-age=${typeConfig.max_age}, s-maxage=${typeConfig.s_max_age}`;
}

export const tanam_onDocWriteUpdateCache = functions.firestore.document('/{type}/{documentId}').onWrite(async (snap, context) => {
  console.log(`${context.eventType} ${context.params.type}/${context.params.documentId}`);
  const docBeforeChange = snap.before.data();

  const domain = await site.getDomain();
  console.log(`[getCacheHeader] Site domain: ${domain}`);
  if (snap.before.exists && !!docBeforeChange.path) {
    await Promise.all([
      // Sitemap will only be purged, not heated. Let it lazily be triggered by crawlers.
      requestPurge(domain, '/sitemap.xml'),
      requestPurge(domain, docBeforeChange.path[0])
    ]);
  }

  const docAfterChange = snap.after.data();
  if (snap.after.exists && !!docAfterChange.path) {
    const SLEEP_SECONDS = 15;
    console.log(`[getCacheHeader] Sleep for ${SLEEP_SECONDS} seconds.`);
    await new Promise((resolve) => setTimeout(resolve, 1000 * SLEEP_SECONDS)); // Sleep for a while before heating cache
    return requestHeat(domain, docAfterChange.path[0]);
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
      // Removes the "themes/<theme name>" and makes it into a path that will resolve as a Tanam theme file should
      const themeAssetPath = '/theme/' + themeFile.name.split('/').filter(item => !!item).splice(2).join('/');
      promises.push(requestPurge(domain, themeAssetPath));
    }

    for (const document of documents) {
      promises.push(requestPurge(domain, document.data().path[0]));
    }
  }

  return Promise.all(promises);
});

export function requestPurge(host: string, path: string) {
  console.log(`[purgeCache] ${host}${path}`);
  const opts = {
    hostname: host,
    port: 443,
    path: path,
    method: 'PURGE'
  };

  return new Promise((resolve, _) => {
    https.get(opts, (res) => {
      console.log(`[purgeCache] Finished request: ${res.statusCode} ${res.statusMessage}`);
      resolve(res);
    });
  });
}

export function requestHeat(host: string, path: string) {
  console.log(`[heatCache] ${host}${path}`);
  const opts = {
    hostname: host,
    port: 443,
    path: path,
    method: 'GET'
  };

  return new Promise((resolve, _) => {
    https.get(opts, (res) => {
      console.log(`[heatCache] Finished request: ${res.statusCode} ${res.statusMessage}`);
      resolve(res);
    });
  });
}
