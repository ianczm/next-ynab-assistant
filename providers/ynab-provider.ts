import YnabService from "@/services/ynab-service";

export default class YnabProvider {
  static instance: YnabService | null = null;

  static get() {
    if (this.instance !== null) {
      return this.instance;
    } else {
      this.instance = new YnabService();
      return this.instance;
    }
  }
}
