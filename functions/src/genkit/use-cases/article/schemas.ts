import {z} from "zod";

export const InputSchemaArticleFlow = z.object({
  contentAudio: z.string().url().optional().describe("The storage path of the audio file to generate the article from"),
  transcript: z.string().describe("Transcript to generate the article from"),
});

export const OutputSchemaArticleFlow = z.object({
  documentId: z.string().describe("The ID of the generated article document"),
});

/**
 * Input schema for the generateArticle flow.
 */
export const InputSchemaArticle = z.object({
  contentAudio: z.string().url().optional().describe("The URL of the audio file to generate the article from"),
  transcript: z.string().describe("Transcript to generate the article from"),
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
export const OutputSchemaArticle = z
  .object({
    title: z.string().describe("The title of the generated article"),
    content: z.string().describe("The content of the generated article in html format"),
    tags: z.array(z.string()).optional().describe("The tags associated with the generated article"),
    synopsis: z.string().optional().describe("A 150-160 character synopsis of the generated article used for SEO."),
  })
  .describe("The generated article data object");

export type InputSchemaArticleFlowType = z.infer<typeof InputSchemaArticleFlow>;
export type OutputSchemaArticleFlowType = z.infer<typeof OutputSchemaArticleFlow>;
export type InputSchemaArticleType = z.infer<typeof InputSchemaArticle>;
export type OutputSchemaArticleType = z.infer<typeof OutputSchemaArticle>;
