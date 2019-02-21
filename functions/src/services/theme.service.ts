import * as admin from 'firebase-admin';
import { SiteInformation, Theme } from '../../../models';

const siteCollection = () => admin.firestore().collection('tanam').doc(process.env.GCLOUD_PROJECT);

export async function getTheme() {
    const siteInfo = (await siteCollection().get()).data() as SiteInformation;
    const themeSnap = await siteCollection().collection('themes').doc(siteInfo.theme).get();
    return themeSnap.data() as Theme;
}
