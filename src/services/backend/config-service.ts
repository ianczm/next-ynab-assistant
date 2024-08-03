import { zodSingleton } from "@/lib/zod/zod-singleton";
import { ServerConfigSchema } from "@/types/backend/server-config";

export const configService = zodSingleton(ServerConfigSchema);
