import { z } from "zod";

export const AccountReconciliationInfoSchema = z.object({
  description: z.string().min(1),
  payeeId: z.string().uuid(),
});

export const AccountSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  reconciliationInfo: AccountReconciliationInfoSchema,
  balance: z.number(),
});

export type Account = z.infer<typeof AccountSchema>;

export type AccountReconciliationInfo = z.infer<typeof AccountReconciliationInfoSchema>;

export const accountToDescriptionMap: { [budgetId: string]: AccountReconciliationInfo } = {
  DEFAULT: {
    description: "Reconciliation Balance Adjustment",
    payeeId: "93040187-38ed-4e7c-be6c-cb9f995e1c2b",
  },
  "046918fa-6a2c-4f6e-8453-a522dc5164c5": {
    description: "Daily GO+ Interest",
    payeeId: "75a5de12-50c3-4068-8353-8c1be41d5785",
  },
  "1f17e57a-c4e3-4334-b61c-a6729ed343cb": {
    description: "Daily Interest",
    payeeId: "e08c1e0b-c97b-4142-9015-282bc8223e8d",
  },
};
