import { ClientConfig, ClientConfigSchema } from "@/types/frontend/client-config";

export default class ClientConfigProvider {
  static config: ClientConfig | null = null;

  static get(): ClientConfig {
    if (this.config !== null) {
      return this.config;
    } else {
      this.config = ClientConfigProvider.validate({
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      } as ClientConfig);
      return this.config;
    }
  }

  private static validate(env: unknown): ClientConfig {
    return ClientConfigSchema.parse(env);
  }
}
