import {defineTool} from "@genkit-ai/ai";
import axios from "axios";
import cheerio from "cheerio";
import TurndownService from "turndown";
import * as z from "zod";

export const urlToMarkdown = defineTool(
  {
    name: "urlToMarkdown",
    description: "Use this tool to fetch a website from a URL as markdown",
    inputSchema: z.string(),
    outputSchema: z.string().describe("A Markdown representation of the fetched content"),
  },
  async (url) => {
    return await fetchAndConvertToMarkdown(url);
  },
);

/**
 * Fetch the HTML content from the given URL and convert it to Markdown.
 * @param {string} url - The URL of the article to fetch.
 * @returns {Promise<string>} - The Markdown representation of the article content.
 */
async function fetchAndConvertToMarkdown(url: string): Promise<string> {
  try {
    const {data} = await axios.get<string>(url);
    const $ = cheerio.load(data);

    // Extract the main content of the website
    const articleTitle = $("title").html() || "";
    const articleContent = $("body").html() || "";

    // Convert the HTML content to Markdown
    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(articleContent);

    return `# ${articleTitle}\n\n${markdown}`;
  } catch (error) {
    console.error(`Error fetching or converting content from ${url}:`, error);
    return "";
  }
}
