import * as z from "zod";

/**
 * Input schema for the generateArticle flow.
 */
export const inputSchema = z.object({
  audioUrl: z.string().url().describe("The URL of the audio file to generate the article from"),
  articleUrls: z.array(z.string().url()).describe("The URLs of the articles to generate the content from"),
  minuteRead: z
    .number()
    .min(1)
    .optional()
    .default(3)
    .describe("The desired minute read length of the generated article"),
});

/**
 * Output schema for the generateArticle flow.
 */
export const outputSchema = z
  .object({
    title: z.string().describe("The title of the generated article"),
    content: z.string().describe("The content of the generated article"),
  })
  .describe("The generated article content");
