import { zodSingleton } from "@/lib/zod/zod-singleton";
import { ClientConfigSchema } from "@/types/frontend/client-config";

export const configService = zodSingleton(ClientConfigSchema, {
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
});
