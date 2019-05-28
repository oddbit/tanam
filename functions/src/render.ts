import * as cheerio from 'cheerio';
import * as dust from 'dustjs-helpers';
import { PageContext } from './models';
import * as documentContextService from './services/page-context.service';
import * as documentService from './services/document.service';
import * as siteInfoService from './services/site-info.service';
import * as templateService from './services/template.service';

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
  console.log(`[dust.helpers.document] Getting document id: ${JSON.stringify(params.id)}`);
  if (!params.document) {
    console.error(`[dust.helpers.document] Missing reference parameter "document"`);
    throw new Error(`Dust helper must declare referencing context ID.`);
  }

  const pageContext = await documentContextService.getPageContextById(params.id);
  await documentService.addDependency(params.document.id, pageContext.document.id);
  return pageContext;
}

dust.helpers.documents = async (chunk, context, bodies, params) => {
  console.log(`[dust.helpers.documents] Getting documents: ${JSON.stringify({
    limit: params.limit,
    documentType: params.documentType,
    orderBy: params.orderBy,
    sortOrder: params.sortOrder
  })}`);
  if (!params.document) {
    console.error(`[dust.helpers.document] Missing reference parameter "document"`);
    throw new Error(`Dust helper must declare referencing context ID.`);
  }

  const pageContexts = await documentContextService.queryPageContext(params.documentType, {
    limit: params.limit,
    orderBy: {
      field: params.orderBy,
      sortOrder: params.sortOrder,
    },
  });

  try {
    await documentService.addDependency(params.document.id, pageContexts.map(pageContext => pageContext.document.id));
    console.log(`[addDependencySuccess] Success`)
  } catch (error) {
    console.warn(`[addDependencyError] ${JSON.stringify(error)}`)
  }
  console.log(`[pageContextsResult] ${JSON.stringify(pageContexts)}`)
  return pageContexts;
}

export async function compileTemplate(context: PageContext) {
  const templates = await templateService.getTemplates();
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

export async function renderPage(context: PageContext): Promise<string> {
  const siteInfo = await siteInfoService.getSiteInfo();
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
