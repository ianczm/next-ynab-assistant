import { z } from "zod";

export const AccountSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  reconcileDescription: z.string().min(1),
  balance: z.number(),
});

export type Account = z.infer<typeof AccountSchema>;

export const mockAccounts: Account[] = [
  {
    id: "1",
    name: "TnG",
    reconcileDescription: "Daily GO+ Interest",
    balance: 80.12,
  },
  {
    id: "2",
    name: "GX",
    reconcileDescription: "Daily Interest",
    balance: 200.11,
  },
];
