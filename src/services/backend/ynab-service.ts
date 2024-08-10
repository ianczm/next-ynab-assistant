import { ServerConfig } from "@/data/backend/server-config";
import { Accounts, Transactions } from "@/data/backend/ynab/api-dto";
import { Account } from "@/data/common/accounts";
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

    const request = {transactions}

    return await this.client
      .post<Transactions.PostResponse>(`/budgets/${budgetId}/transactions`, request)
      .then((response) => {
        console.dir(
          {
            endpoint: `POST /budgets/${budgetId}/transactions`,
            request: request,
            response: response,
          },
          { depth: 10 },
        );
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

  async getAccount(budgetId: string, accountId: string): Promise<Accounts.Response> {
    const response = await this.client.get<Accounts.Response>(`/budgets/${budgetId}/accounts/${accountId}`);
    console.dir({ endpoint: `GET /budgets/${budgetId}/accounts/${accountId}`, response: response }, { depth: 10 });
    return response;
  }

  async getAllAccounts(budgetId: string): Promise<Accounts.MultiResponse> {
    const response = await this.client.get<Accounts.MultiResponse>(`/budgets/${budgetId}/accounts`);
    console.log({ endpoint: `GET /budgets/${budgetId}/accounts`, response: response });
    return response;
  }

  async postReconcileAccount(budgetId: string, accountReconciliation: Account): Promise<Account> {
    const CATEGORY_INFLOW = "1fb564a8-1484-4e97-bf6d-77b9f9b2b662";

    const currentAccount = await this.getAccount(budgetId, accountReconciliation.id);
    const { id, name } = currentAccount.data.account;

    const currentBalance = currentAccount.data.account.balance;
    const intendedBalance = currencyToMilliUnits(accountReconciliation.balance);
    const balanceAdjustment = intendedBalance - currentBalance;

    console.log("Calculating balance:", { id, name, currentBalance, intendedBalance, balanceAdjustment });

    const transaction = {
      account_id: accountReconciliation.id,
      date: moment().utc().format("YYYY-MM-DD"),
      amount: balanceAdjustment,
      payee_id: accountReconciliation.reconciliationInfo.payeeId,
      category_id: CATEGORY_INFLOW,
      memo: accountReconciliation.reconciliationInfo.description,
      cleared: "cleared",
      approved: false,
    } as SaveTransaction;

    const createTransactionResponse = await this.client.post<Transactions.PostResponse>(
      `/budgets/${budgetId}/transactions`,
      {
        transaction: transaction,
      },
    );

    console.dir(
      { endpoint: `POST /budgets/${budgetId}/transactions`, request: transaction, response: createTransactionResponse },
      { depth: 10 },
    );

    return accountReconciliation;
  }
}
