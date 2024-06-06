import {noAuth, onFlow} from "@genkit-ai/firebase/functions";

import {generate} from "@genkit-ai/ai";
import {geminiPro} from "@genkit-ai/googleai";
import {logger} from "firebase-functions/v2";
import {generatePrompt} from "./prompt";
import {InputSchema, OutputSchema} from "./schemas";

/**
 * Generate an article from the given audio and article URLs.
 *
 */
export const generateArticleFlow = onFlow(
  {
    name: "generateArticleFlow",
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
    authPolicy: noAuth(),
  },
  async (inputData) => {
    logger.debug("generateArticle", {inputData});

    const llmResponse = await generate({
      model: geminiPro,
      config: {
        temperature: 0.3,
      },
      // tools: [urlToMarkdown],
      prompt: generatePrompt(InputSchema.parse(inputData)),
    });

    return llmResponse.text();
  },
);
