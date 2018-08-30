
import * as url from 'url';

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

export function getContentType(requestUrl: string) {
  const requestPath = url.parse(requestUrl).pathname;
  console.log(`[getContentType] Resolving content type for: ${requestPath}`);
  for (const contentType in supportedContentTypes) {
    if (supportedContentTypes[contentType].test(requestPath)) {
      console.log(`[getContentType] Content type ${contentType} for: ${requestPath}`);
      return contentType;
    }
  }

  console.log(`[getContentType] No special content type found for: ${requestPath}`);
  return 'default';
}