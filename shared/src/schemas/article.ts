import {z} from "zod";

export const ArticleSchema = z.object({
  title: z.string().default("").describe("Title of the article"),
  content: z.string().default("").describe("Content of the article"),
  blurb: z.string().default("").describe("SEO summary of the article"),
  tags: z.array(z.string()).default([]).describe("List of tags for the article"),
});
