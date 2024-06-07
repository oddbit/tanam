import {noAuth, onFlow} from "@genkit-ai/firebase/functions";
import {prompt} from "@genkit-ai/dotprompt";

import {InputSchema, OutputSchema} from "./schemas";

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
    const llmPrompt = await prompt("tweetPrompt");
    const llmResponse = await llmPrompt.generate({input: inputData});

    return OutputSchema.parse(llmResponse.output());
  },
);
