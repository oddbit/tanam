import * as admin from 'firebase-admin';
import { SiteInformation, Theme } from '../models';

const siteCollection = () => admin.firestore().collection('tanam').doc(process.env.GCLOUD_PROJECT);

export async function getTheme() {
    const siteInfo = (await siteCollection().get()).data() as SiteInformation;
    const themeSnap = await siteCollection().collection('themes').doc(siteInfo.theme).get();
    return themeSnap.data() as Theme;
}

export async function createDefaultTheme() {
    const defaultTheme: Theme = {
        id: 'default',
        title: 'Default theme',
        description: 'Default site theme',
        created: admin.firestore.FieldValue.serverTimestamp(),
        updated: admin.firestore.FieldValue.serverTimestamp(),
    };

    console.log(`[createDefaultTheme] ${JSON.stringify({ defaultTheme }, null, 2)}`);

    return admin.firestore()
        .collection('tanam').doc(process.env.GCLOUD_PROJECT)
        .collection('themes').doc('default')
        .set(defaultTheme);
}
