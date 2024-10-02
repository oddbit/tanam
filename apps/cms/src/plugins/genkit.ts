"use server";

import {runFlow} from "@genkit-ai/flow";
import {ArticleSchema} from "@tanam/domain-frontend";
import {articleFlow} from "@tanam/genkit";
import {z} from "zod";

/**
 * Generates an article based on the provided recording URL and length.
 * This method runs server-side and uses the Genkit AI flow to generate the article.
 * @param {string} recordingUrl - The URL of the recording.
 * @param {number} length - The length of the recording.
 * @param {User} user - Firebase user
 * @return {Promise<ArticleData>} - A promise that resolves to the generated article.
 */
export async function generateArticle(recordingUrl: string, length: number): Promise<z.infer<typeof ArticleSchema>> {
  // Run the Genkit flow with the given recording URL and length
  const result = await runFlow(articleFlow, {recordingUrl, length});

  // Validate the result with ArticleSchema to ensure it conforms
  console.log("Generated article:", result);
  return ArticleSchema.parse(result);
}
