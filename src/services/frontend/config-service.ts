import { ClientConfigSchema } from "@/data/frontend/client-config";
import { zodSingleton } from "@/lib/zod/zod-singleton";

export const configService = zodSingleton(ClientConfigSchema, {
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
});
