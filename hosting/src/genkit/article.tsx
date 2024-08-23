"use server";

import {definePrompt, generate, renderPrompt} from "@genkit-ai/ai";
import {configureGenkit} from "@genkit-ai/core";
import {defineFlow, runFlow} from "@genkit-ai/flow";
import {gemini15Pro, googleAI} from "@genkit-ai/googleai";
import {z} from "zod";

export async function generateArticle(input: z.infer<typeof PromptInputSchema>) {
  return runFlow(articleFlow, input);
}


const PromptInputSchema = z.object({
  length: z.number().optional().default(3).describe("Length of the article in minutes of reading time"),
  recordingUrl: z.string().describe("URL to a voice recording"),
});

const PromptOutputSchema = z.object({
  title: z.string().default("").describe("Title of the article"),
  content: z.string().default("").describe("Content of the article"),
  blurb: z.string().default("").describe("SEO summary of the article"),
  tags: z.array(z.string()).default([]).describe("List of tags for the article"),
});

export const articlePrompt = definePrompt(
  {
    name: "articlePrompt",
    inputSchema: PromptInputSchema,
  },
  async (input) => {
    return {
      output: {
        format: "json",
        schema: PromptOutputSchema,
      },
      config: {temperature: 0.6},
      messages: [
        {
          role: "system",
          content: [
            {
              text: `
            # Persona
            You are a ghostwriter AI for the user. You are writing articles in the style of the user.

            # Strategy
            If the user has provided examples of article texts, then you will use them to learn from 
            the user's writing style and write articles in the same style.

            You use the same tone, style of language, word choices, paragraph lengths and structure 
            as the user's previous articles.

            You write articles based on a voice recording provided by the user. You take the recording 
            and you elaborate on it, adding more detail, reduce repetitions and structure the content
            to a more coherent and engaging article.

            You also learn from the user's provided recording to understand the user's speaking style
            and you use that to write articles that sound like the user's voice. But you do not write
            articles that sounds like a transcript of the recording. You write articles that are
            properly structured as articles and following good standards of writing.

            Your target is to create articles that are engaging, informative and easy to read. You 
            aim to tell a story, provide information or entertain the reader.

            # Rules
            ## Title
              - Title should be max 60 characters. It can be shorter.
              - Choose a natural and engaging title for the article.

            ## Article 
              - Make the article about ${input.length} minutes of read time.
              - Adjust the length of article to represent the amount of content provided in the input recording.                 
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
        {
          role: "user",
          content: [
            {
              text: `
            Write an article from the provided recording.

            The generated output **must** strictly follow the provided output schema.
              title: z.string().default("").describe("Title of the article"),
              content: z.string().default("").describe("Content of the article"),
              blurb: z.string().default("").describe("SEO summary of the article"),
              tags: z.array(z.string()).default([]).describe("List of tags for the article"),
            `,
            },
            {media: {url: input.recordingUrl}},
          ],
        },
      ],
    };
  },
);

export const articleFlow = defineFlow(
  {
    name: "articleFlow",
    inputSchema: PromptInputSchema,
    outputSchema: PromptOutputSchema,
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
      return PromptOutputSchema.parse(response || {});
    } catch (error) {
      console.error("Failed to parse genkit output:", error);
      throw new Error("Invalid AI output format");
    }
  },
);
