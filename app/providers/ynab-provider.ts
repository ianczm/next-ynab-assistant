import YnabService from "../ynab/YnabService";

export default class YnabProvider {
  static instance: YnabService | null = null;

  static getInstance() {
    if (this.instance !== null) {
      return this.instance;
    } else {
      this.instance = new YnabService();
      return this.instance;
    }
  }
}
