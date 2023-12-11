import { ReceivablesService } from "@/services/receivables-service";
import YnabProvider from "@/providers/ynab-provider";

export default class ReceivablesProvider {
  static instance: ReceivablesService | null = null;

  static get() {
    if (this.instance !== null) {
      return this.instance;
    } else {
      this.instance = new ReceivablesService(YnabProvider.get());
      return this.instance;
    }
  }
}
