
import * as admin from 'firebase-admin';
import { CacheTask, CacheTaskAction } from '../models';

const baseRef = (siteId) => admin.database().ref('tanam').child(siteId).child('tasks');
const cacheQueueRef = (siteId) => baseRef(siteId).child('cache');


async function makeCacheTask(siteId: string, domain: string, path: string, action: CacheTaskAction) {
    const taskQueueRef = cacheQueueRef(siteId);

    if (!path) {
        return null;
    }

    const cacheTask = {
        action: action,
        domain: domain,
        url: path,
    } as CacheTask;

    console.log(`[makeCacheTask] ${JSON.stringify(cacheTask)}`);
    return taskQueueRef.push(cacheTask);
}

export const updateCache = (siteId: string, domain: string, path: string) => makeCacheTask(siteId, domain, path, 'update');
export const deleteCache = (siteId: string, domain: string, path: string) => makeCacheTask(siteId, domain, path, 'delete');
