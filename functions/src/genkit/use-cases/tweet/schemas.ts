import {z} from "zod";

/**
 * Input schema for the tweet flow.
 */
export const InputSchema = z.object({
  topic: z.string().describe("The topic to tweet about"),
});

/**
 * Output schema for the tweet flow.
 */
export const OutputSchema = z.object({
  tweet: z.string().describe("The content of the tweet"),
  hashtags: z.array(z.string()).describe("The hashtags used in the tweet"),
});
