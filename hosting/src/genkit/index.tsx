import {configureGenkit} from "@genkit-ai/core";
import {firebase} from "@genkit-ai/firebase";

configureGenkit({
  plugins: [firebase()],
  enableTracingAndMetrics: true,
  telemetry: {
    instrumentation: "firebase",
    logger: "firebase",
  },
});

export * from "./article";
