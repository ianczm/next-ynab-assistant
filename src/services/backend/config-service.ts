import { ServerConfigSchema } from "@/data/backend/server-config";
import { zodSingleton } from "@/lib/zod/zod-singleton";

export const configService = zodSingleton(ServerConfigSchema);
