import {prompt} from "@genkit-ai/dotprompt";
import {noAuth, onFlow} from "@genkit-ai/firebase/functions";
import {firestore} from "firebase-admin";
import {onValueCreated} from "firebase-functions/v2/database";
import {TanamDocumentAdmin} from "../../../models/TanamDocumentAdmin";
import {
  InputSchemaArticleFlow,
  InputSchemaArticleFlowType,
  OutputSchemaArticle,
  OutputSchemaArticleFlow,
  OutputSchemaArticleFlowType,
} from "./schemas";
import {getArticles} from "./tools";

export const generateArticleData = onValueCreated("/articleFlow/", async (event) => {
  await event.data.ref.remove();
  const inputData = InputSchemaArticleFlow.parse(event.data.val());
  return generateArticleLlm(inputData);
});

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
    inputSchema: InputSchemaArticleFlow,
    outputSchema: OutputSchemaArticleFlow,
    authPolicy: noAuth(),
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
 * @param {InputSchemaArticleFlowType} inputData - The input data for generating the article.
 * @return {Promise<OutputSchemaArticleFlowType>} The generated article data.
 */
export async function generateArticleLlm(inputData: InputSchemaArticleFlowType): Promise<OutputSchemaArticleFlowType> {
  const llmPrompt = await prompt("generateArticlePrompt");
  const articles = await getArticles();
  const llmResponse = await llmPrompt.generate({
    input: {
      transcript: inputData.transcript,
      contentAudio: inputData.contentAudio,
      articles,
      minuteRead: 3,
    },
  });
  console.log(llmResponse.toJSON());

  const article = OutputSchemaArticle.parse(llmResponse.output());
  const articleRef = firestore().collection("tanam-documents").doc();
  const tanamDocument = new TanamDocumentAdmin(articleRef.id, {
    data: article,
    documentType: "article",
    createdAt: firestore.Timestamp.now(),
    updatedAt: firestore.Timestamp.now(),
  });
  await articleRef.set(tanamDocument.toJson());
  return {documentId: tanamDocument.id};
}
