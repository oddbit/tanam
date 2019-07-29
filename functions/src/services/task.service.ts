import * as admin from 'firebase-admin';

const taskQueueRef = (siteId) => admin.database().ref('tanam').child(siteId).child('tasks');

export type TanamTaskQueueAction = 'create' | 'update' | 'delete';

export async function cacheTask(action: TanamTaskQueueAction, siteId: string, path: string): Promise<void> {
  if (!path) {
    return null;
  }
  console.log(`[makeCacheTask] ${JSON.stringify({ siteId, path, action })}`);
  return taskQueueRef(siteId).child('cache').child(action).push(path).then(() => null);
}

export async function fetchThemeTask(siteId: string, url: string): Promise<void> {
  await taskQueueRef(siteId).child('get-theme').push(url);
  return null;
}
