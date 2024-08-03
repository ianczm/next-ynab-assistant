import { HttpClientAdapter, HttpClientAdapterConfig } from "@/lib/adapters/http-client";
import { TollsDTO, TollsDTOSchema } from "@/types/backend/internal/tolls";
import { Toll } from "@/types/common/tolls";
import { Moment } from "moment";
import { configService } from "./config-service";

export class ApiService {
  private static readonly UNIQUE_TOLLS = "/transactions/tolls/unique";
  private static readonly CREATE_TOLLS = "/transactions/tolls/create";
  private static instance: ApiService | null = null;

  private readonly client: HttpClientAdapter;

  static get() {
    if (this.instance !== null) {
      return this.instance;
    } else {
      this.instance = new ApiService();
      return this.instance;
    }
  }

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