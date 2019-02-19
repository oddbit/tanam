import * as admin from 'firebase-admin';
import { SiteInformation } from '../../../models';

export async function getSiteInfo() {
    const siteInfoDoc = await admin.firestore().collection('tanam').doc(process.env.GCLOUD_PROJECT).get();
    return siteInfoDoc.data() as SiteInformation;
}
