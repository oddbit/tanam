import * as admin from 'firebase-admin';

admin.initializeApp();

export interface Configuration { }
export function configure(configuration: Configuration) {
  console.log("Hello World");
};

export * from './admin_client';