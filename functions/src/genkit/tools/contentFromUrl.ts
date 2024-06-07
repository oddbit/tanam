import {defineTool} from "@genkit-ai/ai";
import axios from "axios";
import {load} from "cheerio";
import sanitizeHtml from "sanitize-html";
import TurndownService from "turndown";
import * as z from "zod";

export const ContentFromUrlInputSchema = z.string().url().describe("The URL of the website to fetch");
export const ContentFromUrlOutputSchema = z.object({
  title: z.string().describe("The title of the fetched article"),
  content: z.string().describe("The content of the fetched article in markdown format"),
});

export type ContentFromUrlInputType = z.infer<typeof ContentFromUrlInputSchema>;
export type ContentFromUrlOutputType = z.infer<typeof ContentFromUrlOutputSchema>;

export const contentFromUrl = defineTool(
  {
    name: "contentFromUrl",
    description: "Use this tool to fetch website content from a URL",
    inputSchema: ContentFromUrlInputSchema,
    outputSchema: ContentFromUrlOutputSchema,
  },
  fetchContent,
);

/**
 * Fetch the HTML content from the given URL and convert it to Markdown.
 *
 * @param {ContentFromUrlInputType} input The article to fetch.
 * @return {Promise<ContentFromUrlOutputType>} - The article content.
 */
export async function fetchContent(input: ContentFromUrlInputType): Promise<ContentFromUrlOutputType> {
  const sanitizedUrl = z.string().url().parse(input).trim();
  try {
    const {data} = await axios.get<string>(sanitizedUrl);
    const $ = load(data);

    // Sanitize the HTML content to remove unnecessary tags and attributes
    const sanitizedContent = sanitizeHtml($("body").html() || "", {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ["src", "alt"],
      },
      allowedSchemes: ["http", "https", "data"],
    });

    // Convert the sanitized HTML content to Markdown
    const turndownService = new TurndownService();

    return {
      title: $("title").text() || "<No title found>",
      content: turndownService.turndown(sanitizedContent),
    };
  } catch (error) {
    console.error(`Error fetching or converting content from ${sanitizedUrl}:`, error);
    return {
      title: "Error",
      content: `Error fetching or converting content from ${sanitizedUrl}`,
    };
  }
}
