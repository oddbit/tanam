import {ArticleSchema} from "@tanam/domain-frontend";
import {z} from "zod";

export const PromptInputSchema = z.object({
  length: z.number().optional().default(3).describe("Length of the article in minutes of reading time"),
  recordingUrl: z.string().describe("URL to a voice recording"),
  sampleArticles: z.array(ArticleSchema).default([]).optional().describe("List of sample articles to learn from"),
});
