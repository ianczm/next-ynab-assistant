import { z } from "zod";

export const ServerConfigSchema = z.object({
  YNAB_BASE_URL: z.string().min(1),
  YNAB_ACCESS_TOKEN: z.string().min(1),
  YNAB_DEFAULT_BUDGET_ID: z.string().min(1),
});

export type ServerConfig = z.infer<typeof ServerConfigSchema>;
