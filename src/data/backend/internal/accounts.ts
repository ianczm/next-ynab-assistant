import { AccountSchema } from "@/data/common/accounts";
import { z } from "zod";

export const AccountsDTOSchema = z.object({
  data: z.array(AccountSchema),
});

export type AccountsDTO = z.infer<typeof AccountsDTOSchema>;
