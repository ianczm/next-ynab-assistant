import { HttpClientAdapter, HttpClientAdapterConfig } from "@/lib/adapters/http-client";
import { parseType } from "@/lib/mappers/transactions";
import { currencyToMilliUnits, milliUnitsToCurrency } from "@/lib/utils/currency";
import ServerConfigProvider from "@/providers/server-config-provider";
import { Toll } from "@/types/domain/tolls";
import { SimpleTransactionDTO, SimpleTransactionDTOSchema } from "@/types/domain/transactions";
import { ServerConfig } from "@/types/server-config";
import moment, { Moment } from "moment";
import { Accounts, Budgets, CurrentUserResponse, Transactions } from "./api-dto";
import SaveTransaction = Transactions.SaveTransaction;

export default class YnabService {
  appConfig: ServerConfig;
  client: HttpClientAdapter;

  constructor() {
    this.appConfig = ServerConfigProvider.get();
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

  async getCurrentUser(): Promise<CurrentUserResponse> {
    return await this.client.get<CurrentUserResponse>("/user");
  }

  async getBudgetSummary(): Promise<Budgets.MultiResponse> {
    return await this.client.get<Budgets.MultiResponse>("/budgets");
  }

  async getAllAccounts(budgetId: string) {
    return await this.client.get<Accounts.MultiResponse>(`/budgets/${budgetId}/accounts`);
  }

  async getAllTransactions(budgetId: string, revalidate?: boolean): Promise<Transactions.MultiResponse> {
    return await this.client.get<Transactions.MultiResponse>(`/budgets/${budgetId}/transactions`, { revalidate });
  }

  async createInvestment(budgetId: string, accountId: string, investment: SimpleTransactionDTO) {
    function getPayeeIdByAccount(accountId: string) {
      switch (accountId) {
        // Luno
        case "1fc5652c-9307-4f65-9a84-75068f73876b":
          return "8a1b6743-abc1-4f9d-9a18-8daed98c4092";
        // Stashaway
        case "2b04754e-f4b3-4388-a4d5-777b95f27874":
          return "18899e6a-a474-4605-9e7f-cccb7f8d9d8e";

        default:
          throw new Error("Unexpected accountId, no payeeId available");
      }
    }

    const transaction = {
      account_id: accountId,
      date: moment(investment.date).format("YYYY-MM-DD"),
      amount: currencyToMilliUnits(investment.amount),
      payee_id: getPayeeIdByAccount(accountId),
      category_id: null,
      memo: `Update ${moment(investment.date).format("DD/MM/YYYY")}`,
      cleared: "cleared",
      approved: false,
    } as SaveTransaction;

    const result = await this.client
      .post<Transactions.PostResponse>(`/budgets/${budgetId}/transactions`, { transaction: transaction })
      .then((response) => {
        console.log({ endpoint: `POST /budgets/${budgetId}/transactions`, response: response });
        return response.data.transaction;
      });

    return SimpleTransactionDTOSchema.parse({
      id: result?.id,
      date: moment(result?.date).toISOString(),
      amount: milliUnitsToCurrency(result?.amount ?? 0),
      type: parseType(result?.memo ?? null),
    } as SimpleTransactionDTO);
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
      .then(
        (response) =>
          response.data.transactions?.map((transaction) => ({
            name: transaction.memo,
            amount: -1 * milliUnitsToCurrency(transaction.amount),
            id: transaction.id,
          })),
      );
  }
}
