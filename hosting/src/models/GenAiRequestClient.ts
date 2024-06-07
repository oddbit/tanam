import {Timestamp} from "firebase/firestore";
import {GenAiRequest} from "@functions/models/GenAiRequest";
import {z} from "zod";
import {TanamDocumentDataSchema} from "@functions/models/TanamDocumentData";

export const GenAiRequestClientSchema = z.object({
  createdAt: z.instanceof(Timestamp).describe("The timestamp of the creation"),
  updatedAt: z.instanceof(Timestamp).describe("The timestamp of the last update"),
  data: TanamDocumentDataSchema.describe("The data for the GenAI request"),
  generatedDoc: z.string().optional().describe("The ID of the generated document"),
  useCase: z.enum(["article", "event"]),
});

// Infer the TypeScript type from the Zod schema
type GenAiRequestClientType = z.infer<typeof GenAiRequestClientSchema>;

export class GenAiRequestClient extends GenAiRequest<Timestamp, Timestamp> {
  constructor(json: GenAiRequestClientType) {
    super(json);
  }

  protected getServerTimestamp(): Timestamp {
    return Timestamp.now();
  }
}
