import {prompt} from "@genkit-ai/dotprompt";
import {onFlow} from "@genkit-ai/firebase/functions";
import {isSignedInAuthPolicy} from "../../authPolicies";
import {InputSchemaArticle, InputSchemaArticleType, OutputSchemaArticle, OutputSchemaArticleType} from "./schemas";
import {fetchContent} from "../../tools";

/**
 * Generates an article from the given audio and article URLs.
 *
 * This function sets up a flow for generating articles. It defines the flow name, input schema,
 * output schema, and authentication policy. It uses the `onFlow` function from the Genkit AI
 * Firebase functions to create this flow and binds it to the `generateArticleLlm` handler.
 *
 * The flow does not require authentication (`noAuth`) and expects input data that conforms to
 * the `InputSchemaArticle`. The output data will conform to the `OutputSchemaArticle`.
 */
export const generateArticleFlow = onFlow(
  {
    name: "generateArticleFlow",
    inputSchema: InputSchemaArticle,
    outputSchema: OutputSchemaArticle,
    authPolicy: isSignedInAuthPolicy,
  },
  generateArticleLlm,
);

/**
 * Generates an article using a Large Language Model (LLM) based on the provided input data.
 *
 * This asynchronous function processes the input data to generate an article. It first fetches
 * a prompt template named `generateArticlePrompt` using the `prompt` function from Genkit AI.
 * It then manually fetches the contents of the URLs provided in `styleSources`, converting each
 * URL's content to Markdown format.
 *
 * The converted contents are assigned back to the `styleSources` field of the input data. The
 * processed input data is then passed to the LLM prompt to generate the article. The response
 * from the LLM is validated against the `OutputSchemaArticle` and returned.
 *
 * @param {InputSchemaArticleType} inputData - The input data for generating the article.
 * @return {Promise<OutputSchemaArticleType>} The generated article data.
 */
export async function generateArticleLlm(inputData: InputSchemaArticleType): Promise<OutputSchemaArticleType> {
  const llmPrompt = await prompt("generateArticlePrompt");

  // TODO: Check if model is supporting audio input otherwise fetch and convert audio to text

  for (const url of inputData.styleSourceUrls ?? []) {
    const content = await fetchContent(url);
    inputData.styleSources.push(content);
  }

  const llmResponse = await llmPrompt.generate({input: inputData});
  console.log(llmResponse.toJSON());

  return OutputSchemaArticle.parse(llmResponse.output());
}
