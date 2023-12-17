import { ServerConfig, ServerConfigSchema } from "@/types/server-config";

export default class ServerConfigProvider {
  static config: ServerConfig | null = null;

  static get(): ServerConfig {
    if (this.config !== null) {
      return this.config;
    } else {
      this.config = ServerConfigProvider.validate(process.env);
      return this.config;
    }
  }

  private static validate(env: NodeJS.ProcessEnv): ServerConfig {
    return ServerConfigSchema.parse(env);
  }
}
