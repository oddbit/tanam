"use server";
import {definePrompt, generate, renderPrompt} from "@genkit-ai/ai";
import {configureGenkit} from "@genkit-ai/core";
import {firebase} from "@genkit-ai/firebase";
import {defineFlow, runFlow} from "@genkit-ai/flow";
import googleAI, {gemini15Pro} from "@genkit-ai/googleai";
import {ArticleSchema} from "tanam-shared/schemas/article";
import {z} from "zod";
import {zodToJsonSchema} from "zod-to-json-schema";

configureGenkit({
  plugins: [googleAI(), firebase()],
});

export async function generateArticle(input: z.infer<typeof PromptInputSchema>) {
  return runFlow(articleFlow, input);
}

const PromptInputSchema = z.object({
  length: z.number().optional().default(3).describe("Length of the article in minutes of reading time"),
  recordingUrl: z.string().describe("URL to a voice recording"),
  sampleArticles: z.array(ArticleSchema).default([]).optional().describe("List of sample articles to learn from"),
});

const articlePrompt = definePrompt(
  {
    name: "articlePrompt",
    inputSchema: PromptInputSchema,
  },
  async (input) => {
    return {
      output: {
        format: "json",
        schema: ArticleSchema,
      },
      config: {temperature: 0.6},
      messages: [
        {
          role: "system",
          content: [
            {
              text: `
              # Persona
              You are an AI ghostwriter assisting the user in writing articles.

              # Strategy
              Adapt to the user's writing style if provided with example articles. Mirror their 
              tone, word choice, paragraph structure, and overall style.

              When given a voice recording, expand on the content, adding detail, reducing 
              repetition, and structuring the information into a coherent, engaging article. Capture 
              the user's speaking style but ensure the output is a polished article, not a transcript.

              Your goal is to create articles that are engaging, informative, and easy to read, with 
              a focus on storytelling, providing information, or entertainment.
          `,
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              text: "Write an article from the provided recording.",
            },
            {media: {url: input.recordingUrl}},
            {
              text: `
              The generated output must follow the schema: 
              ${JSON.stringify((zodToJsonSchema(ArticleSchema) as {properties: Record<string, unknown>}).properties)}`,
            },
            {
              text: `
              # Articles to learn from 
              ${JSON.stringify(input.sampleArticles)}`,
            },
            {
              text: `
              # Rules
              Rules and guidelines for article generation.
              
              ## Title
                - Title should be max 60 characters. It can be shorter.
                - Choose a natural and engaging title for the article.

              ## Article 
                - Make the article about ${input.length} minutes of read time.
                - Make a lead paragraph that introduces the topic with a hook to engage the reader.
                - Use HTML markup and only using: <h1>,<h2>,<h3>,<p>,<strong>,<em>,<a>,<ul>,<li>,<img>
                - Do not include the title in the article content as header to the article. 

              ## Summary 
                - Article summary/blurb for SEO is recommended 150 characters and max 300 characters.
                - Use plain text. No markup.

              ## Tags
                - Generate 5 tags for the article based on the content. The titles should balance between topic 
                  based and generic enough to be used for other articles also
              `,
            },
          ],
        },
      ],
    };
  },
);

const articleFlow = defineFlow(
  {
    name: "articleFlow",
    inputSchema: PromptInputSchema,
    outputSchema: ArticleSchema,
    authPolicy: (auth) => {
      console.log("Genkit Auth", auth);
      // if (!auth) {
      //   throw new Error("Authorization required.");
      // }
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
