import {noAuth, onFlow} from "@genkit-ai/firebase/functions";

import {prompt} from "@genkit-ai/dotprompt";
import {logger} from "firebase-functions/v2";
import {inputSchema, outputSchema} from "./schemas";

/**
 * Generate an article from the given audio and article URLs.
 *
 */
export const generateArticle = onFlow(
  {
    name: "generateArticle_flow",
    inputSchema,
    outputSchema,
    authPolicy: noAuth(),
  },
  async (inputData) => {
    logger.debug("generateArticle", {inputData});
    const generateArticlePrompt = await prompt("generateArticle_prompt", {});
    const validatedInput = inputSchema.parse(inputData);

    const llmResponse = await generateArticlePrompt.generate({
      input: {
        audioUrl: validatedInput.audioUrl,
        articleUrls: validatedInput.articleUrls,
        minuteRead: validatedInput.minuteRead,
      },
    });

    return outputSchema.parse(llmResponse.data);
  },
);
