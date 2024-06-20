import { Moment } from "moment";
import { z } from "zod";

export const SimpleTransactionDTOSchema = z.object({
  id: z.string().optional(),
  date: z.string().datetime(),
  amount: z.number(),
  type: z.enum(["deposit", "capital", "unknown"]),
});

export type SimpleTransactionDTO = z.infer<typeof SimpleTransactionDTOSchema>;

export const SimpleTransactionListDTOSchema = z.object({
  data: z.array(SimpleTransactionDTOSchema),
});

export type SimpleTransactionListDTO = z.infer<typeof SimpleTransactionListDTOSchema>;

export type SimpleTransaction = {
  id?: string;
  date: Moment;
  amount: number;
  type: "deposit" | "capital" | "unknown";
};
