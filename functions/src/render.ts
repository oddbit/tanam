import * as cheerio from 'cheerio';
import * as dust from 'dustjs-helpers';
import { PageContext, Theme } from './models';
import * as documentContextService from './services/document-context.service';
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

export async function renderPage(context: PageContext): Promise<string> {
    const template = await compileTemplate(context);
    if (!template) {
        console.error(`No template rendered for document ${context.document.id}`);
        return null;
    }

    const $ = cheerio.load(template);
    const $head = $('head');
    if ($head.find('link[rel="canonical"]').length === 0) {
        // Ony add canonical link data if not already present in document
        $head.append(`<link rel="canonical" href="${context.document.permalink}">`)
    }
    return $.html();
}
