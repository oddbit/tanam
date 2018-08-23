import * as admin from 'firebase-admin';

export async function getThemeName() :Promise<string> {
  return (await admin.database().ref('site/settings/theme').once('value')).val() || 'default';
}