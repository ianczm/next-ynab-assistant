import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Budgets, CurrentUserResponse, Transactions } from "./api-dto";
import { Toll } from "@/types/tolls";
import _ from "lodash";
import moment from "moment";
import SaveTransaction = Transactions.SaveTransaction;

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

  async createTollTransactions(tolls: Toll[]) {
    const budgetId: string = "eefbb017-955c-4350-ad22-f7b4d3f53236";
    const dateToday: string = moment().utcOffset(8).format("YYYY-MM-DD");

    const transactions = _(tolls).map(
      (toll) =>
        ({
          account_id: "046918fa-6a2c-4f6e-8453-a522dc5164c5", // tng
          date: dateToday,
          amount: -1 * Math.round(toll.amount * 1000),
          payee_id: "a43f1e55-3e50-4d88-b9f8-d8fe99c4f025", // tolls
          category_id: "8bacc8de-0146-4893-a3b0-2529ac19030a", // tolls
          memo: toll.name,
          cleared: "cleared",
          approved: false,
        }) as SaveTransaction,
    );

    return await this.client
      .post<Transactions.PostResponse>(`/budgets/${budgetId}/transactions`, {
        transactions,
      })
      .then(
        (response) =>
          response.data.data.transactions?.map((transaction) => ({
            name: transaction.memo,
            amount: ((-1 * transaction.amount) / 1000).toFixed(2),
            id: transaction.id,
          })),
      );
  }
}
