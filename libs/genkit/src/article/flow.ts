import {generate, renderPrompt} from "@genkit-ai/ai";
import {defineFlow} from "@genkit-ai/flow";
import {gemini15Pro} from "@genkit-ai/googleai";
import {ArticleSchema} from "@tanam/domain-frontend";
import {articlePrompt} from "./prompt";
import {PromptInputSchema} from "./schema";

export const articleFlow = defineFlow(
  {
    name: "articleFlow",
    inputSchema: PromptInputSchema,
    outputSchema: ArticleSchema,
    authPolicy: (auth) => {
      console.log("[articleFlow:authPolicy]", auth);
      if (!auth) {
        throw new Error("Authorization required.");
      }
    },
  },
  async (input) => {
    console.log(input);

    const llmResponse = await generate(
      renderPrompt({
        prompt: articlePrompt,
        input: input,
        model: gemini15Pro,
        // context: [] use this to provide other articles as style example
      }),
    );

    try {
      const response = llmResponse.output();
      return ArticleSchema.parse(response || {});
    } catch (error) {
      console.error("Failed to parse genkit output:", error);
      throw new Error("Invalid AI output format");
    }
  },
);
