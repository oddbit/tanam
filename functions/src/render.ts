import * as cheerio from 'cheerio';
import * as dust from 'dustjs-helpers';
import { PageContext, DocumentContext } from './models';
import * as documentContextService from './services/page-context.service';
import * as documentService from './services/document.service';
import * as siteInfoService from './services/site-info.service';
import * as templateService from './services/template.service';
import { TanamHttpRequest } from './models/http_request.model';

dust.isDebug = true;

// ----------------------------------------------------------------------------
// DUST HELPERS
// Implements Tanam helper extensions for the template engine
//
dust.helpers.debugDump = (chunk, context, bodies, params) => {
  const data = context.stack.head;
  console.log(`[dust.helpers.debugDump] ${JSON.stringify(data)}`)
  const prefix = !!params.prefix ? `${params.prefix}: ` : '';
  const outputData = JSON.stringify(data, null, 2);
  if (params.to === 'console') {
    console.log(prefix + outputData);
    return chunk;
  }

  return chunk.write(outputData.replace(/</g, '\\u003c'));
}

dust.helpers.document = async (chunk, context, bodies, params) => {
  const requestedId: string = params.id; // The document ID to fetch
  const documentContext: DocumentContext = context.get('document');
  const siteContext = context.get('site');

  console.log(`[dust.helpers.document] ${JSON.stringify({ requestedId })}`);
  if (!requestedId) {
    console.error(`[dust.helpers.document] Missing reference parameter "id"`);
    return chunk.write(dust.helpers.setError(`Dust helper must specify a document ID.`));
  }

  const siteInfo = await siteInfoService.getSiteInfoFromDomain(siteContext.domain);
  const requestedPageContext = await documentContextService.getPageContextById(requestedId);
  await documentService.addDependency(siteInfo, documentContext.id, requestedPageContext.document.id);
  return requestedPageContext;
}

dust.helpers.documents = async (chunk, context, bodies, params) => {
  const siteContext = context.get('site');
  const queryOpts = {
    limit: params.limit,
    orderBy: {
      field: params.orderBy,
      sortOrder: params.sortOrder,
    },
  };

  console.log(`[dust.helpers.documents] ${JSON.stringify({ queryOpts, siteContext })}`);
  const siteInfo = await siteInfoService.getSiteInfoFromDomain(siteContext.domain);
  const requestedPageContexts = await documentContextService.queryPageContext(siteContext.domain, params.documentType, queryOpts);
  try {
    const dependecies = requestedPageContexts.map(ctx => ctx.document.id);
    await documentService.addDependency(siteInfo, params.document.id, dependecies);
    console.log(`[dust.helpers.documents] Success`);
  } catch (error) {
    console.warn(`[dust.helpers.documents] Failed to add dependecies ${JSON.stringify(error)}`)
  }
  return requestedPageContexts;
}

async function compileTemplate(context: PageContext) {
  const siteInfo = await siteInfoService.getSiteInfoFromDomain(context.site.domain);
  const templates = await templateService.getTemplates(siteInfo);
  console.log(`[renderTemplate] Theme has ${templates.length} templates.`);

  for (const template of templates) {
    console.log(`[renderTemplate] Compiling template: ${template.id}`);
    const source = dust.compile(template.template, template.id);
    dust.register(template.id, dust.loadSource(source));
  }

  const currentThemeTemplate = context.document.documentType;
  console.log(`[renderTemplate] ${JSON.stringify({ currentThemeTemplate, context })}`);
  return new Promise<string>((resolve, reject) => {
    dust.render(currentThemeTemplate, context, (err: any, out: string) => {
      if (err) {
        console.log(`[renderDocument] Error rendering: ${JSON.stringify({ err, out })}`);
        reject(JSON.stringify(err));
        return;
      }

      console.log(`[renderDocument] Finished rendering`);
      console.log(`[renderDocument-Result] ${JSON.stringify(out)}`)
      resolve(out);
    });
  });
}

export async function renderErrorPage(request: TanamHttpRequest, error: 'http404' | 'http500' | 'error') {
  console.log(`[renderErrorPage] ${JSON.stringify({ request, error })}`);
  const siteInfo = await siteInfoService.getSiteInfoFromDomain(request.hostname);
  return new Promise<string>(async (resolve, reject) => {
    const template = await templateService.getErrorTemplate(siteInfo, error);
    if (!template) {
      // TODO: Implement default error templates
      resolve(`Error ${error}: ${request.fullyQualifiedUrl}`);
      return;
    }

    const source = dust.compile(template.template, template.id);
    dust.register(template.id, dust.loadSource(source));
    dust.render('http404', {}, (err: any, out: string) => {
      if (err) {
        console.log(`[renderDocument] Error rendering: ${JSON.stringify({ err, out })}`);
        reject();
      }
      console.log(`[renderDocument] Finished rendering`);
      console.log(`[renderDocument-Result] ${JSON.stringify(out)}`)
      const $ = cheerio.load(out);
      resolve($.html());
    });
  });
}

export async function renderPage(context: PageContext): Promise<string> {
  const siteInfo = await siteInfoService.getSiteInfoFromDomain(context.site.domain);
  const template = await compileTemplate(context);
  if (!template) {
    console.error(`No template rendered for document ${context.document.id}`);
    return null;
  }

  const $ = cheerio.load(template);
  const $head = $('head');
  const $body = $('body');

  // Add canonical link
  if ($head.find('link[rel="canonical"]').length === 0) {
    // Ony add canonical link data if not already present in document
    $head.append(`<link rel="canonical" href="${context.document.canonicalUrl || context.document.permalink}">`)
  }

  // Add Google Analytics tracking
  if (siteInfo.analytics && siteInfo.analytics.startsWith('UA')) {
    $head.prepend(`<!-- Global site tag (gtag.js) - Google Analytics -->
            <script async src="https://www.googletagmanager.com/gtag/js?id=${siteInfo.analytics}"></script>
            <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${siteInfo.analytics}');
            </script>`);
  } else if (siteInfo.analytics && siteInfo.analytics.startsWith('GTM')) {
    $head.prepend(`<!-- Google Tag Manager -->
            <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${siteInfo.analytics}');</script>
            <!-- End Google Tag Manager -->`);
    $body.prepend(`<!-- Google Tag Manager (noscript) -->
            <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${siteInfo.analytics}"
            height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
            <!-- End Google Tag Manager (noscript) -->`);
  }

  return $.html();
}
