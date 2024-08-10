import { AccountsDTO, AccountsDTOSchema } from "@/data/backend/internal/accounts";
import { TollsDTO, TollsDTOSchema } from "@/data/backend/internal/tolls";
import { Account, AccountSchema } from "@/data/common/accounts";
import { Toll } from "@/data/common/tolls";
import { HttpClientAdapter, HttpClientAdapterConfig } from "@/lib/adapters/http-client";
import { lazySingleton } from "@/lib/utils/singleton";
import { Moment } from "moment";
import { configService } from "./config-service";

export const apiProvider = lazySingleton(() => new ApiService());

export class ApiService {
  static readonly UNIQUE_TOLLS = "/transactions/tolls/unique";
  static readonly CREATE_TOLLS = "/transactions/tolls/create";
  static readonly ACCOUNTS = "/accounts";
  static readonly RECONCILE_ACCOUNTS = "/accounts/reconcile";

  private readonly client: HttpClientAdapter;

  constructor() {
    this.client = HttpClientAdapter.create(this.provideConfig());
  }

  provideConfig(): HttpClientAdapterConfig {
    const { NEXT_PUBLIC_BASE_URL } = configService.get();
    return {
      baseUrl: NEXT_PUBLIC_BASE_URL,
      headers: { Accept: "application/json" },
    };
  }

  async getUniqueTolls() {
    return await this.client.get<TollsDTO>(ApiService.UNIQUE_TOLLS).then(TollsDTOSchema.parse);
  }

  async postTollTransactions(addedTolls: Toll[], date: Moment) {
    const payload = TollsDTOSchema.parse({ data: addedTolls });
    return await this.client
      .post<TollsDTO>(ApiService.CREATE_TOLLS, payload, {
        headers: {
          "Data-Date": date.format("YYYY-MM-DD"),
        },
      })
      .then(TollsDTOSchema.parse);
  }

  async getAccounts() {
    return await this.client.get<AccountsDTO>(ApiService.ACCOUNTS).then(AccountsDTOSchema.parse);
  }

  async reconcileAccount(accountReconciliation: Account) {
    const payload = AccountSchema.parse(accountReconciliation);
    return await this.client.post<Account>(ApiService.RECONCILE_ACCOUNTS, payload).then(AccountSchema.parse);
  }
}
