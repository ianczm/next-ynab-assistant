import { z } from "zod";

export const ClientConfigSchema = z.object({
  NEXT_PUBLIC_BASE_URL: z.string().min(1),
});

export type ClientConfig = z.infer<typeof ClientConfigSchema>;
