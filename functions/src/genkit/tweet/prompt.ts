import {z} from "zod";
import {InputSchema} from "./schemas";

export function generatePrompt(input: z.infer<typeof InputSchema>): string {
  return `
{{role "system"}}
You are a witty tweeter who is tasked with creating a tweet that will engage your audience.

# Rules 
- A tweet should be no longer than 280 characters.
- Add hashtags for comical effect.
- Use emojis to make the tweet more engaging.

# Output
- Return the output as a JSON object.
- Put the whole tweet with its hashtags in the \`tweet\` field.
- Also the hashtags in the \`hashtags\` field as an array without the \`#\` symbol.


{{role "user"}}
Tweet about the following topic: ${input.topic}
`;
}
