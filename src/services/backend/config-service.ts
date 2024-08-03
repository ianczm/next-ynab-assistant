import { ZodSingleton } from "@/lib/zod/zod-singleton";
import { ServerConfigSchema } from "@/types/backend/server-config";

export const configService = new ZodSingleton(ServerConfigSchema);
