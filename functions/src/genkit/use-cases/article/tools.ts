import {defineTool} from "@genkit-ai/ai";
import {firestore} from "firebase-admin";
import {logger} from "firebase-functions/v2";
import * as z from "zod";

export const ToolGetAritlcesInputSchema = z
  .array(z.string().describe("The ID of the article to fetch"))
  .optional()
  .default([]);

export const ToolGetAritlcesOutputSchema = z.array(
  z.object({
    title: z.string().describe("The title of the fetched article"),
    content: z.string().describe("The content of the fetched article in plain text format"),
  }),
);

export type ToolGetAritlcesInputSchemaType = z.infer<typeof ToolGetAritlcesInputSchema>;
export type ToolGetAritlcesOutputSchemaType = z.infer<typeof ToolGetAritlcesOutputSchema>;

export const getArticlesTool = defineTool(
  {
    name: "getArticles",
    description: "A tool to fetch sample articles for style of writing analysis",
    inputSchema: ToolGetAritlcesInputSchema,
    outputSchema: ToolGetAritlcesOutputSchema,
  },
  getArticles,
);

export async function getArticles(input: ToolGetAritlcesInputSchemaType = []) {
  console.log("Fetching articles with input:", input);
  const articles = await firestore().collection("tanam-documents").where("documentType", "==", "article").get();
  const artcileData = articles.docs
    .map((doc) => doc.data())
    .map((data) => ({title: data.title, content: data.content}));

  logger.debug("[getArticles]", {numArticles: artcileData.length, ids: articles.docs.map((doc) => doc.id)});
  return artcileData;
}
