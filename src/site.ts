import * as admin from 'firebase-admin';

export async function getThemeName(): Promise<string> {
  return (await admin.database().ref('site/settings/theme').once('value')).val() || 'default';
}

export async function getDomain(): Promise<string> {
  return (await admin.database().ref('site/settings/domain').once('value')).val() || `${process.env.GCLOUD_PROJECT}.firebaseapp.com`;
}
