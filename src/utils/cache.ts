import * as https from 'https';

const defaultCacheConfig = {
  cache: {
    serverAge: 60 * 60 * 24 * 365,    // Time in seconds to keep cache on CDN
    clientAge: 60 * 10                // Time in seconds to keep cache in browser
  }
};

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


/**
 * Get the server cache max age preference, as specified in default configuration or
 * overridden by firebase functions configuration.
 *
 * @param functionsConfig Firebase functions configuration
 */export function getServerCacheAge(functionsConfig: any) {
  const cacheConfig = { ...defaultCacheConfig, ...(functionsConfig || {}) };
  return cacheConfig.cache.serverAge;
}

/**
 * Get the client cache max age preference, as specified in default configuration or
 * overridden by firebase functions configuration.
 *
 * @param functionsConfig Firebase functions configuration
 */
export function getClientCacheAge(functionsConfig: any) {
  const cacheConfig = { ...defaultCacheConfig, ...(functionsConfig || {}) };
  return cacheConfig.cache.clientAge;
}