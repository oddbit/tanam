
import * as admin from 'firebase-admin';

const taskQueueRef = (siteId) => admin.database().ref('tanam').child(siteId).child('tasks');
const cacheQueueRef = (siteId) => taskQueueRef(siteId);

async function makeCacheTask(siteId: string, path: string, action: 'create' | 'update' | 'delete') {
    if (!path) {
        return null;
    }
    console.log(`[makeCacheTask] ${JSON.stringify({ siteId, path, action })}`);
    return cacheQueueRef(siteId).child('cache').child(action).push(path).then(() => null);
}

export const createCache = (siteId: string, path: string) => makeCacheTask(siteId, path, 'create');
export const updateCache = (siteId: string, path: string) => makeCacheTask(siteId, path, 'update');
export const deleteCache = (siteId: string, path: string) => makeCacheTask(siteId, path, 'delete');
