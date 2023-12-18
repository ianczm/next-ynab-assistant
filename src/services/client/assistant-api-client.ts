import { TollsDTO, TollsDTOSchema } from "@/types/dto/transactions";
import ClientConfigProvider from "@/providers/client/client-config-provider";
import { Toll } from "@/types/domain/tolls";
import { HttpClientAdapter, HttpClientAdapterConfig } from "@/lib/adapters/http-client";
import { Moment } from "moment";

export class AssistantApiClient {
  private static readonly UNIQUE_TOLLS = "/transactions/tolls/unique";
  private static readonly CREATE_TOLLS = "/transactions/tolls/create";

  private readonly client: HttpClientAdapter;

  constructor() {
    this.client = HttpClientAdapter.create(this.provideConfig());
  }

  provideConfig(): HttpClientAdapterConfig {
    return {
      baseUrl: ClientConfigProvider.get().NEXT_PUBLIC_BASE_URL,
      headers: { Accept: "application/json" },
    };
  }

  async getUniqueTolls() {
    return await this.client.get<TollsDTO>(AssistantApiClient.UNIQUE_TOLLS).then(TollsDTOSchema.parse);
  }

  async postTollTransactions(addedTolls: Toll[], date: Moment) {
    const payload = TollsDTOSchema.parse({ data: addedTolls });
    return await this.client
      .post<TollsDTO>(AssistantApiClient.CREATE_TOLLS, payload, {
        headers: {
          "Data-Date": date.format("YYYY-MM-DD"),
        },
      })
      .then(TollsDTOSchema.parse);
  }
}
