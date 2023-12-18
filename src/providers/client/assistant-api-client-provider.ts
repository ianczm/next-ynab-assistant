import { AssistantApiClient } from "@/services/client/assistant-api-client";

export class AssistantApiClientProvider {
  static instance: AssistantApiClient | null = null;

  static get() {
    if (this.instance !== null) {
      return this.instance;
    } else {
      this.instance = new AssistantApiClient();
      return this.instance;
    }
  }
}
