import { ServerConfig } from "@/data/backend/server-config";
import { Transactions } from "@/data/backend/ynab/api-dto";
import { Toll } from "@/data/common/tolls";
import { HttpClientAdapter, HttpClientAdapterConfig } from "@/lib/adapters/http-client";
import { currencyToMilliUnits, milliUnitsToCurrency } from "@/lib/utils/currency";
import { lazySingleton } from "@/lib/utils/singleton";
import moment, { Moment } from "moment";
import { configService } from "./config-service";
import SaveTransaction = Transactions.SaveTransaction;

export const ynabProvider = lazySingleton(() => new YnabService());

export class YnabService {
  appConfig: ServerConfig;
  client: HttpClientAdapter;

  constructor() {
    this.appConfig = configService.get();
    this.client = HttpClientAdapter.create(this.provideConfig());
  }

  provideConfig(): HttpClientAdapterConfig {
    return {
      baseUrl: this.appConfig.YNAB_BASE_URL,
      headers: {
        Authorization: `Bearer ${this.appConfig.YNAB_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      next: {
        tags: ["server:ynab"],
        revalidate: moment.duration({ hour: 8 }).asSeconds(),
      },
    };
  }

  async getAllTransactions(budgetId: string): Promise<Transactions.MultiResponse> {
    return await this.client.get<Transactions.MultiResponse>(`/budgets/${budgetId}/transactions`);
  }

  async createTollTransactions(budgetId: string, tolls: Toll[], date: Moment) {
    const ACCOUNT_TNG = "046918fa-6a2c-4f6e-8453-a522dc5164c5";
    const PAYEE_TOLLS = "a43f1e55-3e50-4d88-b9f8-d8fe99c4f025";
    const CATEGORY_TOLLS = "8bacc8de-0146-4893-a3b0-2529ac19030a";

    const transactions = tolls.map(
      (toll) =>
        ({
          account_id: ACCOUNT_TNG,
          date: date.format("YYYY-MM-DD"),
          amount: -1 * currencyToMilliUnits(toll.amount),
          payee_id: PAYEE_TOLLS,
          category_id: CATEGORY_TOLLS,
          memo: toll.name,
          cleared: "cleared",
          approved: false,
        }) as SaveTransaction,
    );

    return await this.client
      .post<Transactions.PostResponse>(`/budgets/${budgetId}/transactions`, { transactions: transactions })
      .then((response) => {
        console.log({ endpoint: `POST /budgets/${budgetId}/transactions`, response: response });
        return response;
      })
      .then((response) =>
        response.data.transactions?.map((transaction) => ({
          name: transaction.memo,
          amount: -1 * milliUnitsToCurrency(transaction.amount),
          id: transaction.id,
        })),
      );
  }
}
