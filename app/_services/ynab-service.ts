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

  async getCurrentUser(): Promise<CurrentUserResponse> {
    return await this.client.get<CurrentUserResponse>("/user").then((response) => response.data);
  }

  async getBudgetSummary(): Promise<Budgets.MultiResponse> {
    return await this.client.get<Budgets.MultiResponse>("/budgets").then((response) => response.data);
  }

  async getAllTransactions(budgetId: string): Promise<Transactions.MultiResponse> {
    return await this.client
      .get<Transactions.MultiResponse>(`/budgets/${budgetId}/transactions`)
      .then((response) => response.data);
  }
}
