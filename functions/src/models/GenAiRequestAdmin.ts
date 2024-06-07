import {FieldValue, Timestamp} from "firebase-admin/firestore";
import {z} from "zod";
import {GenAiRequest} from "./GenAiRequest";
import {TanamDocumentDataSchema} from "./TanamDocumentData";

export const GenAiRequestAdminSchema = z.object({
  createdAt: z.instanceof(Timestamp).describe("The timestamp of the creation"),
  updatedAt: z.instanceof(Timestamp).describe("The timestamp of the last update"),
  data: TanamDocumentDataSchema.describe("The data for the GenAI request"),
  generatedDoc: z.string().optional().describe("The ID of the generated document"),
  useCase: z.enum(["article", "event"]),
});

// Infer the TypeScript type from the Zod schema
type GenAiRequestAdminType = z.infer<typeof GenAiRequestAdminSchema>;

export class GenAiRequestAdmin extends GenAiRequest<Timestamp, FieldValue> {
  constructor(json: GenAiRequestAdminType) {
    super(json);
  }

  protected getServerTimestamp(): FieldValue {
    return FieldValue.serverTimestamp();
  }
}
