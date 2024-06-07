import {prompt} from "@genkit-ai/dotprompt";
import {onFlow} from "@genkit-ai/firebase/functions";

import {isSignedInAuthPolicy} from "../../authPolicies";
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
    authPolicy: isSignedInAuthPolicy,
  },
  async (inputData) => {
    const llmPrompt = await prompt("tweetPrompt");
    const llmResponse = await llmPrompt.generate({input: inputData});

    return OutputSchema.parse(llmResponse.output());
  },
);
