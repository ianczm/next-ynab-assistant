import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Budgets, CurrentUserResponse, Transactions } from "./api-dto";
import { Toll } from "@/types/domain/tolls";
import _ from "lodash";
import moment from "moment";
import ConfigProvider from "@/providers/config-provider";
import { Config } from "@/types/config";
import { currencyToMilliUnits, milliUnitsToCurrency } from "@/lib/utils/currency";
import SaveTransaction = Transactions.SaveTransaction;

export default class YnabService {
  appConfig: Config;
  axiosConfig: AxiosRequestConfig;
  client: AxiosInstance;

  constructor() {
    this.appConfig = ConfigProvider.get();
    this.axiosConfig = this.provideConfig();
    this.client = axios.create(this.axiosConfig);
  }

  provideConfig(): AxiosRequestConfig {
    return {
      baseURL: this.appConfig.YNAB_BASE_URL,
      headers: {
        Authorization: `Bearer ${this.appConfig.YNAB_ACCESS_TOKEN}`,
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

  async createTollTransactions(budgetId: string, tolls: Toll[]) {
    const dateToday: string = moment().utcOffset(8).format("YYYY-MM-DD");

    // Todo: this should be dynamic
    const ACCOUNT_TNG = "046918fa-6a2c-4f6e-8453-a522dc5164c5";
    const PAYEE_TOLLS = "a43f1e55-3e50-4d88-b9f8-d8fe99c4f025";
    const CATEGORY_TOLLS = "8bacc8de-0146-4893-a3b0-2529ac19030a";

    const transactions = _(tolls).map(
      (toll) =>
        ({
          account_id: ACCOUNT_TNG,
          date: dateToday,
          amount: -1 * currencyToMilliUnits(toll.amount),
          payee_id: PAYEE_TOLLS,
          category_id: CATEGORY_TOLLS,
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
            amount: -1 * milliUnitsToCurrency(transaction.amount),
            id: transaction.id,
          })),
      );
  }
}
