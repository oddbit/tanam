import {configureGenkit} from "@genkit-ai/core";
import {firebase} from "@genkit-ai/firebase";
import googleAI from "@genkit-ai/googleai";

configureGenkit({
  plugins: [googleAI(), firebase()],
  enableTracingAndMetrics: true,
  telemetry: {
    instrumentation: "firebase",
    logger: "firebase",
  },
});

export * from "./article";
