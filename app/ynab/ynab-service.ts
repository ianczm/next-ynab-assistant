import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Budgets, CurrentUserResponse, Transactions } from "./api-dto";

export default class YnabService {
  config: AxiosRequestConfig;
  client: AxiosInstance;

  constructor() {
    this.config = this.provideConfig();
    this.client = axios.create(this.config);
  }

  provideConfig(): AxiosRequestConfig {
    return {
      baseURL: process.env.YNAB_BASE_URL,
      headers: {
        Authorization: `Bearer ${process.env.YNAB_ACCESS_TOKEN}`,
      },
    };
  }

  getCurrentUser() {
    return this.client.get<CurrentUserResponse>("/user");
  }

  getBudgetSummary() {
    return this.client.get<Budgets.MultiResponse>("/budgets");
  }

  getAllTransactions(budgetId: string) {
    // return Promise.resolve({ data: { data: { budgetId } } });
    return this.client.get<Transactions.MultiResponse>(
      `/budgets/${budgetId}/transactions`
    );
  }
}
