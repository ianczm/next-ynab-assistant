import { TollsDTO, TollsDTOSchema } from "@/data/backend/internal/tolls";
import { Toll } from "@/data/common/tolls";
import { HttpClientAdapter, HttpClientAdapterConfig } from "@/lib/adapters/http-client";
import { lazySingleton } from "@/lib/utils/singleton";
import { Moment } from "moment";
import { configService } from "./config-service";

export const apiProvider = lazySingleton(() => new ApiService());

export class ApiService {
  private static readonly UNIQUE_TOLLS = "/transactions/tolls/unique";
  private static readonly CREATE_TOLLS = "/transactions/tolls/create";

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
}
