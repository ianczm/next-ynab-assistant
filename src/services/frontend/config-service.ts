import { ZodSingleton } from "@/lib/zod/zod-singleton";
import { ClientConfigSchema } from "@/types/frontend/client-config";

export const configService = new ZodSingleton(ClientConfigSchema, {
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
});
