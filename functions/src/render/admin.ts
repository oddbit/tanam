import { join } from 'path';

export function renderAdmin(res, req) {
    const cacheControl = 'public, max-age=600, s-maxage=300, stale-while-revalidate=120';
    console.log(`Cache ${req.url}: ${cacheControl}`);
    res.setHeader('Cache-Control', cacheControl);
    res.sendFile(join(process.cwd(), 'browser/admin.html'));
}
