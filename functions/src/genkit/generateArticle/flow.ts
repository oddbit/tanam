import {noAuth, onFlow} from "@genkit-ai/firebase/functions";

import {prompt} from "@genkit-ai/dotprompt";
import {logger} from "firebase-functions/v2";
import {inputSchema, outputSchema} from "./schemas";

/**
 * Generate an article from the given audio and article URLs.
 *
 */
export const generateArticleFlow = onFlow(
  {
    name: "generateArticleFlow",
    inputSchema,
    outputSchema,
    authPolicy: noAuth(),
  },
  async (inputData) => {
    logger.debug("generateArticle", {inputData});
    const generateArticlePrompt = await prompt("generateArticlePrompt", {});
    const validatedInput = inputSchema.parse(inputData);

    const llmResponse = await generateArticlePrompt.generate({
      input: {
        contentAudio: validatedInput.contentAudio,
        styleSources: validatedInput.styleSources,
        minuteRead: validatedInput.minuteRead,
      },
    });

    return outputSchema.parse(llmResponse.data);
  },
);
