import * as admin from 'firebase-admin';
import { TanamFile, Document, SiteInformation } from '../../../models';

const siteCollection = () => admin.firestore().collection('tanam').doc(process.env.GCLOUD_PROJECT);

export async function getFavicon() {
    const contentFile = await admin.storage().bucket().file('/tanam/favicon.ico');
    const [contentExists] = await contentFile.exists();
    if (!contentExists) {
        return null;
    }
    const [fileContent] = await contentFile.download();
    return fileContent;
}

export async function getImageFile(fileId: string, variant?: 'large' | 'medium' | 'small') {
    console.log(`[getImageFile] ${JSON.stringify({ fileId, variant})}`);
    const doc = await siteCollection()
        .collection('files').doc(fileId)
        .get();

    const tanamFile = doc.data() as TanamFile;
    console.log(`[getImageFile] ${JSON.stringify({ tanamFile })}`);

    const storagePath = tanamFile.variants[variant] || tanamFile.filePath;
    const contentFile = await admin.storage().bucket().file(storagePath);
    const [contentExists] = await contentFile.exists();
    if (!contentExists) {
        return null;
    }

    const [fileContent] = await contentFile.download();
    const bytesOfData = (fileContent.byteLength / 1024).toFixed(2);
    console.log(`[getCloudStorageFile] File '${storagePath}' size: ${bytesOfData} kB`);
    return fileContent;
}

export async function getSitemap() {
    const siteInfo = (await siteCollection().get()).data() as SiteInformation;
    const documentsQuery = await siteCollection()
        .collection('documents')
        .get();

    const entries = [];
    documentsQuery.forEach(doc => {
        const document = doc.data() as Document;
        const url = document.url;
        const updated = document.updated.toDate();
        const created = document.created.toDate();
        const daysOfExistence = Math.round((updated - created) / (1000 * 60 * 60 * 24));
        const changeFrequency = daysOfExistence / (document.revision + 1);
        let sitemapChangeFreq: string;
        if (changeFrequency < 7) {
            sitemapChangeFreq = 'daily';
        } else if (changeFrequency < 30) {
            sitemapChangeFreq = 'weekly';
        } else if (changeFrequency < 365) {
            sitemapChangeFreq = 'monthly';
        } else {
            sitemapChangeFreq = 'yearly';
        }
        entries.push(`
            <url>
                <loc>https://${siteInfo.primaryDomain}/${url}</loc>
                <lastmod>${document.updated.toDate().toISOString().substr(0, 10)}</lastmod>
                <changefreq>${sitemapChangeFreq}</changefreq>
            </url>
        `);
    });

    return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join('')}</urlset>`;
}
