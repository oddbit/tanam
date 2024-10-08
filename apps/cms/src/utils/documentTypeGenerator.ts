import {LocalizedString, TanamDocumentField, TanamDocumentType} from "@tanam/domain-frontend";

export interface IDocumentTypeDataResult {
  data: TanamDocumentType;
  fields: TanamDocumentField[];
}

export function getDocumentTypeArticle(): IDocumentTypeDataResult {
  const data = new TanamDocumentType(
    "article",
    new LocalizedString({en: "Article"}),
    new LocalizedString({en: "Articles"}),
    new LocalizedString({en: "Article such as a blog post or a published article."}),
    "title",
    true,
  );

  const fields: TanamDocumentField[] = [
    new TanamDocumentField("title", {
      weight: 1000,
      title: new LocalizedString({en: "Title"}),
      description: new LocalizedString({en: "Article title"}),
      type: "string",
      validators: ["required"],
    }),
    new TanamDocumentField("featuredImage", {
      weight: 2000,
      title: new LocalizedString({en: "Featured image"}),
      description: new LocalizedString({
        en: "Featured image to display on the article page and to use for social media sharing.",
      }),
      type: "image",
      validators: ["required"],
    }),
    new TanamDocumentField("content", {
      weight: 3000,
      title: new LocalizedString({en: "Content"}),
      description: new LocalizedString({
        en: "Content body of the article.",
      }),
      type: "html",
      validators: ["required"],
    }),
    new TanamDocumentField("canonicalUrl", {
      weight: 4000,
      title: new LocalizedString({en: "Canonical URL"}),
      description: new LocalizedString({
        en: "Content body of the article.",
      }),
      type: "string",
      validators: ["url"],
    }),
    new TanamDocumentField("tags", {
      weight: 5000,
      title: new LocalizedString({en: "Tags"}),
      description: new LocalizedString({
        en: "Tags to categorize the article.",
      }),
      type: "array:string",
      validators: ["url"],
    }),
  ];

  return {data, fields};
}

export function getDocumentTypePerson(): IDocumentTypeDataResult {
  const data = new TanamDocumentType(
    "person",
    new LocalizedString({en: "Person"}),
    new LocalizedString({en: "People"}),
    new LocalizedString({en: "People such as authors, contributors, and staff members."}),
    "name",
    true,
  );

  const fields: TanamDocumentField[] = [
    new TanamDocumentField("name", {
      weight: 1000,
      title: new LocalizedString({en: "Name"}),
      description: new LocalizedString({en: "Full name"}),
      type: "string",
      validators: ["required"],
    }),
    new TanamDocumentField("image", {
      weight: 2000,
      title: new LocalizedString({en: "Image"}),
      description: new LocalizedString({
        en: "Photo of the person.",
      }),
      type: "image",
      validators: [],
    }),
    new TanamDocumentField("bio", {
      weight: 3000,
      title: new LocalizedString({en: "Bio"}),
      description: new LocalizedString({
        en: "Bio or description of the person.",
      }),
      type: "text-paragraph",
      validators: [],
    }),
  ];

  return {data, fields};
}
