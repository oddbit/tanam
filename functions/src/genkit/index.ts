import {configureGenkit} from "@genkit-ai/core";
import {dotprompt} from "@genkit-ai/dotprompt";

import {firebase} from "@genkit-ai/firebase";
import {googleAI} from "@genkit-ai/googleai";

configureGenkit({
  plugins: [firebase(), googleAI({apiKey: "yourKey"}), dotprompt()],
  logLevel: "debug",
  flowStateStore: "firebase",
  traceStore: "firebase",
  enableTracingAndMetrics: true,
});

export * from "./generateArticle";
export * from "./tools";
