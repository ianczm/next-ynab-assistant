import { z } from "zod";
import { TollSchema } from "@/types/domain/tolls";
import { AccountSchema } from "@/types/domain/accounts";

export const TollsDTOSchema = z.object({
  data: z.array(TollSchema),
});

export type TollsDTO = z.infer<typeof TollsDTOSchema>;

export const AccountsDTOSchema = z.object({
  data: z.array(AccountSchema),
});

export type AccountsDTO = z.infer<typeof AccountsDTOSchema>;
