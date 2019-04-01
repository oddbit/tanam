import * as dust from 'dustjs-helpers';
import { PageContext, Theme } from '../../models';
import * as documentContextService from './services/document-context.service';
import * as templateService from './services/template.service';
import { getTheme } from './services/theme.service';

// ----------------------------------------------------------------------------
// DUST HELPERS
// Implements Tanam helper extensions for the template engine
//
dust.helpers.document = (chunk, context, bodies, params) => {
    console.log(`[dust.helpers.document] Getting document id: ${JSON.stringify(params.id)}`);
    if (!params.document) {
        console.error(`[dust.helpers.document] Missing reference parameter "document"`);
        throw new Error(`Dust helper must declare referencing context ID.`);
    }

    return documentContextService.getDocumentContextById(params.id);
}

dust.helpers.documents = (chunk, context, bodies, params) => {
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

    return documentContextService.queryDocumentContext(params.documentType, {
        limit: params.limit,
        orderBy: {
            field: params.orderBy,
            sortOrder: params.sortOrder,
        },
    });
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
            resolve(out);
        });
    });
}

function renderThemeStyles(theme: Theme): string[] {
    return theme.styles.filter(s => !!s && s.trim().length).map(style =>
        style.startsWith('http') ? `<link href="${style}" rel="stylesheet" />` : style
    );
}

function renderThemeScripts(theme: Theme): string[] {
    return theme.scripts.filter(s => !!s && s.trim().length).map(script =>
        script.startsWith('http')
            ? `<script src="${script}"></script>`
            : `<script type="text/javascript">${script}</script>`
    );
}

export async function renderPage(context: PageContext) {
    const theme = await getTheme();
    const template = await compileTemplate(context);
    if (!template) {
        console.error(`No template rendered for document ${context.document.id}`);
        return null;
    }

    return `<!doctype html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>${context.document.title} | ${context.site.title}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="icon" type="image/x-icon" href="/favicon.ico">
            <link rel="canonical" href="https://${context.document.permalink}">
            ${renderThemeStyles(theme).join('\n')}
        </head>

        <body>
        ${template}
        ${renderThemeScripts(theme).join('\n')}
        </body>
        </html>`;
}
