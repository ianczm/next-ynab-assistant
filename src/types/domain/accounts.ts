import { z } from "zod";

export const AccountSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum([
    "checking",
    "savings",
    "cash",
    "creditCard",
    "lineOfCredit",
    "otherAsset",
    "otherLiability",
    "mortgage",
    "autoLoan",
    "studentLoan",
    "personalLoan",
    "medicalDebt",
    "otherDebt",
  ]),
  note: z.string().nullable(),
  balance: z.number(),
  lastReconciliation: z.string().datetime().nullable(),
});

export type Account = z.infer<typeof AccountSchema>;
