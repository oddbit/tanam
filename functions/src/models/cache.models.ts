export type CacheTaskAction = 'create' | 'update' | 'delete';

export interface CacheTask {
    action: CacheTaskAction;
    domain: string;
    url: string;
}
