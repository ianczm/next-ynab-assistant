import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { CurrentUserResponse } from "./data";

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

  getCurrentUser() {
    return this.client.get<CurrentUserResponse>("/user");
  }

  getCurrentBudget() {
    return this.client.get("/budgets");
  }
}
