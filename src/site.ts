import * as admin from 'firebase-admin';

export interface SiteInfo {
  name: string;
  domain: string;
  // TODO: More info
}

export abstract class SiteFirebasePath {
  static readonly themeName = 'site/settings/theme';
  static readonly domain = 'site/settings/domain';
}

export async function getThemeName(): Promise<string> {
  return (await admin.database().ref(SiteFirebasePath.themeName).once('value')).val() || 'default';
}

export function getDefaultDomain() {
  return `${process.env.GCLOUD_PROJECT}.firebaseapp.com`;
}

export async function getPrimaryDomain(): Promise<string> {
  return (await admin.database().ref(SiteFirebasePath.domain).once('value')).val() || getDefaultDomain();
}

export async function getDomains(): Promise<string[]> {
  const domains = [`${process.env.GCLOUD_PROJECT}.firebaseapp.com`];
  const domainSnap = await admin.database().ref(SiteFirebasePath.domain).once('value');
  if (domainSnap.exists()) {
    domains.push(domainSnap.val());
  }
  return domains;
}

export async function getSiteInfo() {
  const defaultData: SiteInfo = {
    name: process.env.GCLOUD_PROJECT,
    domain: await getPrimaryDomain()
  };

  const siteInfoData = (await admin.database().ref('site/info').once('value')).val() || {};
  return { ...defaultData, ...siteInfoData } as SiteInfo;
}
