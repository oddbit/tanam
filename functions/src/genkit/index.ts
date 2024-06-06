import {configureGenkit} from "@genkit-ai/core";
import {dotprompt} from "@genkit-ai/dotprompt";

import {firebase} from "@genkit-ai/firebase";
import {googleAI} from "@genkit-ai/googleai";
import * as dotenv from "dotenv";

dotenv.config();

configureGenkit({
  plugins: [firebase(), googleAI({apiKey: process.env.GOOGLE_GENAI_API_KEY}), dotprompt()],
  logLevel: "debug",
  flowStateStore: "firebase",
  traceStore: "firebase",
  enableTracingAndMetrics: true,
});

export * from "./generateArticle";
export * from "./tweet";
export * from "./tools";
