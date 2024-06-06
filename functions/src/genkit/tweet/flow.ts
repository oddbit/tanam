import {noAuth, onFlow} from "@genkit-ai/firebase/functions";

import {generate} from "@genkit-ai/ai";
import {logger} from "firebase-functions/v2";
import {generatePrompt} from "./prompt";
import {InputSchema, OutputSchema} from "./schemas";
import {geminiPro} from "@genkit-ai/googleai";

/**
 * Generate an article from the given audio and article URLs.
 *
 */
export const tweetFlow = onFlow(
  {
    name: "tweetFlow",
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
    authPolicy: noAuth(),
  },
  async (inputData) => {
    logger.debug("tweet", {inputData});
    const llmResponse = await generate({
      model: geminiPro,
      prompt: generatePrompt(InputSchema.parse(inputData)),
      output: {
        format: "json",
      },
    });

    return llmResponse.output();
  },
);
