import { ReceivablesService } from "@/app/_services/receivables-service";
import YnabProvider from "@/app/_providers/ynab-provider";

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
