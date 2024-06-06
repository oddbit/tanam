import {z} from "zod";

/**
 * Input schema for the generateArticle flow.
 */
export const InputSchema = z.object({
  contentAudio: z.string().url().optional().describe("The URL of the audio file to generate the article from"),
  contentSource: z.string().optional().describe("Text or URL that contain information on what to write"),
  styleSources: z.array(z.string()).describe("Texts or URLs of sources that indicate the writing style"),
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
export const OutputSchema = z
  .object({
    title: z.string().describe("The title of the generated article"),
    content: z.string().describe("The content of the generated article"),
  });
