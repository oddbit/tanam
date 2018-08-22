import * as https from 'https';

const defaultCacheConfig = {
  cache: {
    server_age: 60 * 60 * 24 * 365,    // Time in seconds to keep cache on CDN
    client_age: 60 * 10                // Time in seconds to keep cache in browser
  }
};

export function purgeCache(host: string, path: string) {
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

export function heatCache(host: string, path: string) {
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


/**
 * Get the server cache max age preference, as specified in default configuration or
 * overridden by firebase functions configuration.
 *
 * @param functionsConfig Firebase functions configuration
 */
export function getServerCacheAge(functionsConfig: any) {
  const cacheConfig = { ...defaultCacheConfig, ...(functionsConfig || {}) };
  return cacheConfig.cache.server_age;
}

/**
 * Get the client cache max age preference, as specified in default configuration or
 * overridden by firebase functions configuration.
 *
 * @param functionsConfig Firebase functions configuration
 */
export function getClientCacheAge(functionsConfig: any) {
  const cacheConfig = { ...defaultCacheConfig, ...(functionsConfig || {}) };
  return cacheConfig.cache.client_age;
}