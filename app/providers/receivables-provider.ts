import { ReceivablesService } from "@/app/services/receivables-service";
import YnabProvider from "@/app/providers/ynab-provider";

export default class ReceivablesProvider {
  static instance: ReceivablesService | null = null;

  static getInstance() {
    if (this.instance !== null) {
      return this.instance;
    } else {
      this.instance = new ReceivablesService(YnabProvider.getInstance());
      return this.instance;
    }
  }
}
