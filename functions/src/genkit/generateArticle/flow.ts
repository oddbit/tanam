import {prompt} from "@genkit-ai/dotprompt";
import {noAuth, onFlow} from "@genkit-ai/firebase/functions";
import {InputSchema, OutputSchema} from "./schemas";
import {z} from "zod";
import {fetchAndConvertToMarkdown} from "../tools";

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
    const llmPrompt = await prompt("generateArticlePrompt");

    // Manually fetching URLs since the `urlToMarkdown` tool does not seem
    // to be working when using in the prompt
    const contentSources = [];
    for (const source of inputData.styleSources || []) {
      if (z.string().url().safeParse(source).success) {
        const content = await fetchAndConvertToMarkdown(source);
        contentSources.push(content);
      }
    }
    inputData.styleSources = contentSources;
    const llmResponse = await llmPrompt.generate({input: inputData});
    return OutputSchema.parse(llmResponse.output());
  },
);
