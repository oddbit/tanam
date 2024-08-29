import {z} from "zod";

export const TanamDocumentDataSchema = z.record(z.unknown());
export interface TanamDocumentData {
  [key: string]: unknown;
}
