import { Config, ConfigSchema } from "@/types/config";

export default class ConfigProvider {
  static config: Config | null = null;

  static get(): Config {
    if (this.config !== null) {
      return this.config;
    } else {
      this.config = ConfigProvider.validate(process.env);
      return this.config;
    }
  }

  private static validate(env: NodeJS.ProcessEnv): Config {
    return ConfigSchema.parse(env);
  }
}
