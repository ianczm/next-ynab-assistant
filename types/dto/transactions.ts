import { z } from "zod";
import { TollSchema } from "@/types/domain/tolls";

export const TollsDTOSchema = z.object({
  data: z.array(TollSchema),
});

export type TollsDTO = z.infer<typeof TollsDTOSchema>;
