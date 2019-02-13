import * as dust from 'dustjs-helpers';
import { DocumentContext, SiteTheme } from '../../models';
import * as documentContextService from './services/document-context.service';
import { getSiteInfo } from './services/site-info.service';
import * as templateService from './services/template.service';
import { getTheme } from './services/theme.service';

// ----------------------------------------------------------------------------
// DUST HELPERS
// Implements Tanam helper extensions for the template engine
//
dust.helpers.document = (chunk, context, bodies, params) => {
    if (!params.contextId) {
        throw new Error(`Dust helper must declare referencing context ID.`);
    }

    return documentContextService.getDocumentContextById(params.id);
}

dust.helpers.documents = (chunk, context, bodies, params) => {
    if (!params.contextId) {
        throw new Error(`Dust helper must declare referencing context ID.`);
    }

    return documentContextService.queryDocumentContext(params.documentType, {
        limit: params.limit,
        orderBy: {
            field: params.orderBy,
            sortOrder: params.sortOrder,
        },
    });
}



export async function renderTemplate(context: DocumentContext) {
    const templates = await templateService.getTemplates();

    for (const template of templates) {
        console.log(`[renderDocument] Compiling template: ${template.id}`);
        const source = dust.compile(template.template, template.id);
        dust.register(template.id, dust.loadSource(source));
    }

    const currentDocumentTemplate = context.documentType;

    return new Promise<string>((resolve, reject) => {
        dust.render(currentDocumentTemplate, context, (err: any, out: string) => {
            if (err) {
                console.log(`[renderDocument] Error rendering: ${JSON.stringify(err)}`);
                reject(JSON.stringify(err));
            } else {
                console.log(`[renderDocument] Finished rendering`);
                resolve(out);
            }
        });
    });
}

function renderThemeStyles(theme: SiteTheme): string[] {
    return theme.styles.filter(s => !!s && s.trim().length).map(style =>
        style.startsWith('http') ? `<link href="${style}" rel="stylesheet" />` : style
    );
}

function renderThemeScripts(theme: SiteTheme): string[] {
    return theme.scripts.filter(s => !!s && s.trim().length).map(script =>
        script.startsWith('http')
            ? `<script src="${script}"></script>`
            : `<script type="text/javascript">${script}</script>`
    );
}

export async function renderDocument(context: DocumentContext) {
    const siteInfo = await getSiteInfo();
    const template = await renderTemplate(context);
    const theme = await getTheme();

    return `<!doctype html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>${context.title} | ${siteInfo.title}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="icon" type="image/x-icon" href="/favicon.ico">
            <link rel="canonical" href="https://${siteInfo.primaryDomain}">
            ${renderThemeStyles(theme).join('\n')}
        </head>

        <body>${template}</body>
        ${renderThemeScripts(theme).join('\n')}
        </html>`;
}
