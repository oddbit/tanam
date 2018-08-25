import * as admin from 'firebase-admin';

export interface SiteInfo {
  name: string;
  domain: string;
  // TODO: More info
}

export async function getThemeName(): Promise<string> {
  return (await admin.database().ref('site/settings/theme').once('value')).val() || 'default';
}

export async function getDomain(): Promise<string> {
  return (await admin.database().ref('site/settings/domain').once('value')).val() || `${process.env.GCLOUD_PROJECT}.firebaseapp.com`;
}


export async function getSiteInfo() {
  const defaultData: SiteInfo = {
    name: process.env.GCLOUD_PROJECT,
    domain: await getDomain()
  };

  const siteInfoData = (await admin.database().ref('site/info').once('value')).val() || {};
  return {...defaultData, ...siteInfoData} as SiteInfo;
}
