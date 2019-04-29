import * as admin from 'firebase-admin';
import { TanamFile, Document, SiteInformation } from '../models';
import * as siteInfoService from '../services/site-info.service';

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

export async function getThemeAssetsFile(filePath: string) {
    console.log(`[getThemeAssetsFile] ${JSON.stringify({ filePath })}`);
    const siteInfo = await siteInfoService.getSiteInfo();

    const storagePath = `/tanam/${siteInfo.id}/themes/${siteInfo.theme}/${filePath}`;

    console.log(`[getThemeAssetsFile] ${JSON.stringify({ storagePath })}`);
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

export async function getImageFile(fileId: string, variant?: 'large' | 'medium' | 'small') {
    console.log(`[getImageFile] ${JSON.stringify({ fileId, variant })}`);
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

const supportedContentTypes = {
    'audio/aac': /\.(aac)$/i,
    'application/x-abiword': /\.(abw)$/i,
    'application/octet-stream': /\.(arc|bin)$/i,
    'video/x-msvideo': /\.(avi)$/i,
    'application/vnd.amazon.ebook': /\.(azw)$/i,
    'application/x-bzip': /\.(bz)$/i,
    'application/x-bzip2': /\.(bz2)$/i,
    'application/x-csh': /\.(csh)$/i,
    'text/csv; charset=utf-8': /\.(csv)$/i,
    'application/msword': /\.(doc)$/i,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': /\.(docx)$/i,
    'application/vnd.ms-fontobject': /\.(eot)$/i,
    'application/epub+zip': /\.(epub)$/i,
    'application/ecmascript; charset=utf-8': /\.(es)$/i,
    'text/calendar; charset=utf-8': /\.(ics)$/i,
    'application/java-archive': /\.(jar)$/i,
    'audio/midi': /\.(mid|midi)$/i,
    'video/mpeg': /\.(mpeg)$/i,
    'application/vnd.apple.installer+xml': /\.(mpkg)$/i,
    'application/vnd.oasis.opendocument.presentation': /\.(odp)$/i,
    'application/vnd.oasis.opendocument.spreadsheet': /\.(ods)$/i,
    'application/vnd.oasis.opendocument.text': /\.(odt)$/i,
    'audio/ogg': /\.(oga)$/i,
    'video/ogg': /\.(ogv)$/i,
    'application/ogg': /\.(ogx)$/i,
    'application/pdf': /\.(pdf)$/i,
    'application/vnd.ms-powerpoint': /\.(ppt)$/i,
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': /\.(pptx)$/i,
    'application/x-rar-compressed': /\.(rar)$/i,
    'application/rtf': /\.(rtf)$/i,
    'application/x-sh; charset=utf-8': /\.(sh)$/i,
    'application/x-tar': /\.(tar)$/i,
    'application/typescript; charset=utf-8': /\.(ts|d\.ts)$/i,
    'application/vnd.visio': /\.(vsd)$/i,
    'audio/wav': /\.(wav)$/i,
    'audio/webm': /\.(weba)$/i,
    'video/webm': /\.(webm)$/i,
    'image/webp': /\.(webp)$/i,
    'application/vnd.ms-excel': /\.(xls)$/i,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': /\.(xlsx)$/i,
    'application/xml; charset=utf-8': /\.(xml)$/i,
    'application/vnd.mozilla.xul+xml': /\.(xul)$/i,
    'application/zip': /\.(zip)$/i,
    'application/x-7z-compressed': /\.(7z)$/i,
    'font/otf': /\.(otf)$/i,
    'font/ttf': /\.(ttf)$/i,
    'font/woff': /\.(woff)$/i,
    'font/woff2': /\.(woff2)$/i,
    'image/jpeg': /\.(jpg|jpeg)$/i,
    'image/gif': /\.(gif)$/i,
    'image/png': /\.(png)$/i,
    'image/tiff': /\.(tif|tiff)$/i,
    'image/bmp': /\.(bmp)$/i,
    'image/ico': /\.(ico)$/i,
    'image/svg+xml': /\.(svg)$/i,
    'text/plain; charset=utf-8': /\.(txt)$/i,
    'text/css; charset=utf-8': /\.(css)$/i,
    'text/javascript; charset=utf-8': /\.(js|js\.map)$/i,
    'application/json; charset=utf-8': /\.(json)$/i,
    'text/template': /\.(dust|hbs|ejs)$/i
};

export function getContentTypeFromPath(filePath: string) {
    console.log(`[getContentTypeFromPath] Resolving content type for: ${filePath}`);
    for (const contentType in supportedContentTypes) {
        if (supportedContentTypes[contentType].test(filePath)) {
            console.log(`[getContentTypeFromPath] Content type ${contentType} for: ${filePath}`);
            return contentType;
        }
    }

    console.log(`[getContentTypeFromPath] No special content type found for: ${filePath}`);
    return 'default';
}
