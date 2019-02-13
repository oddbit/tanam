import * as admin from 'firebase-admin';
import { SiteInformation, DocumentTemplate, DocumentContext, DocumentType } from '../../../models';

const siteCollection = () => admin.firestore().collection('tanam').doc(process.env.GCLOUD_PROJECT);

export async function getTemplates() {
    const siteInfo = (await siteCollection().get()).data() as SiteInformation;
    const templatesSnap = await siteCollection()
        .collection('themes').doc(siteInfo.theme)
        .collection('templates')
        .get();

    return templatesSnap.docs.map(doc => doc.data() as DocumentTemplate);
}
