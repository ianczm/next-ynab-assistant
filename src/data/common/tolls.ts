import { z } from "zod";

export const TollSchema = z.object({
  id: z.string().optional(),
  displayName: z.string().optional(),
  name: z.string().min(1),
  amount: z.number().min(0),
});

export type Toll = z.infer<typeof TollSchema>;
