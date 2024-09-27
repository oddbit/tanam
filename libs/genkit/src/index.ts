import {configureGenkit} from "@genkit-ai/core";
import {firebase} from "@genkit-ai/firebase";
import googleAI from "@genkit-ai/googleai";
import * as dotenv from "dotenv";

if (process.env.GENKIT_ENV === "dev" || process.env.NODE_ENV === "development") {
  // Load environment variables for local development
  // See .env file in root of repo
  dotenv.config();
}

configureGenkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
    firebase(),
  ],
  flowStateStore: "firebase",
  traceStore: "firebase",
  enableTracingAndMetrics: true,
  logLevel: "info",
});

export * from "./article";
