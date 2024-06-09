import {defineTool} from "@genkit-ai/ai";
import axios from "axios";
import {load} from "cheerio";
import {convert} from "html-to-text";
import * as z from "zod";

export const ContentFromUrlInputSchema = z.string().url().describe("The URL of the website to fetch");
export const ContentFromUrlOutputSchema = z.object({
  title: z.string().describe("The title of the fetched article"),
  content: z.string().describe("The content of the fetched article in plain text format"),
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
 * Fetch the HTML content from the given URL and convert it to plain text.
 *
 * @param {ContentFromUrlInputType} input The article to fetch.
 * @return {Promise<ContentFromUrlOutputType>} - The article content.
 */
export async function fetchContent(input: ContentFromUrlInputType): Promise<ContentFromUrlOutputType> {
  const sanitizedUrl = z.string().url().parse(input).trim();
  try {
    const {data} = await axios.get<string>(sanitizedUrl);
    const $ = load(data);
    const htmlBody = $("body").html() || "";
    const htmlTitle = $("title").text() || "<No title found>";

    // Convert the sanitized HTML content to plain text
    const plainText = convert(htmlBody, {
      wordwrap: 130, // Adjust word wrapping as needed
      selectors: [
        {selector: "img", format: "skip"}, // Skip images if needed
      ],
    });

    return {
      title: htmlTitle,
      content: plainText,
    };
  } catch (error) {
    console.error(`Error fetching or converting content from ${sanitizedUrl}:`, error);
    return {
      title: "Error",
      content: `Error fetching or converting content from ${sanitizedUrl}`,
    };
  }
}
