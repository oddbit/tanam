import {z} from "zod";
import {ContentFromUrlOutputSchema} from "../../tools";

/**
 * Input schema for the generateArticle flow.
 */
export const InputSchemaArticle = z.object({
  contentAudio: z.string().url().optional().describe("The URL of the audio file to generate the article from"),
  transcript: z.string().describe("Transcript to generate the article from"),
  styleSources: z
    .array(ContentFromUrlOutputSchema)
    .optional()
    .default([])
    .describe("Articles of sources that indicate the writing style"),
  styleSourceUrls: z
    .array(z.string().url())
    .optional()
    .default([])
    .describe("URLs of sources that indicate the writing style"),
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
    content: z.string().describe("The content of the generated article in markdown format"),
  })
  .describe("The generated article data object");

export type InputSchemaArticleType = z.infer<typeof InputSchemaArticle>;
export type OutputSchemaArticleType = z.infer<typeof OutputSchemaArticle>;
