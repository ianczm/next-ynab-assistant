import _ from "lodash";

export type HttpClientAdapterConfig = {
  baseUrl: string;
  headers: HeadersInit;
  next?: NextFetchRequestConfig;
};

export class HttpClientAdapter {
  baseUrl: string;
  headers: HeadersInit;
  nextConfig: NextFetchRequestConfig;

  static create(config: HttpClientAdapterConfig) {
    return new HttpClientAdapter(config);
  }

  constructor(config: HttpClientAdapterConfig) {
    this.baseUrl = config.baseUrl;
    this.headers = config.headers;
    this.nextConfig = config.next ?? {};
  }

  private baseInit(method: string): RequestInit {
    return {
      method: method,
      headers: this.headers,
      next: this.nextConfig,
    };
  }

  private baseInitNoCache(method: string): RequestInit {
    return {
      method: method,
      headers: this.headers,
      next: {
        revalidate: 0,
      },
    };
  }

  // {
  //   ..._.merge(options?.revalidate ? this.baseInitNoCache("GET") : this.baseInit("GET"), {
  //     headers: options?.headers,
  //   }),
  // }

  async get<T>(url: string, options?: { revalidate?: boolean; headers?: HeadersInit }) {
    return await fetch(this.baseUrl + url, {
      method: "GET",
      headers: _.merge(this.headers, options?.headers),
      next: _.merge(this.nextConfig, { revalidate: options?.revalidate ? 0 : undefined }),
    }).then((response) => response.json() as T);
  }

  async options<T>(url: string) {
    throw new Error("Method not implemented.");
  }

  async head<T>(url: string) {
    throw new Error("Method not implemented.");
  }

  async post<T>(url: string, data: any, options?: { headers?: HeadersInit }) {
    return await fetch(this.baseUrl + url, {
      ..._.merge(this.baseInitNoCache("POST"), options),
      body: JSON.stringify(data),
    }).then((response) => response.json() as T);
  }

  async patch<T>(url: string, data: any) {
    throw new Error("Method not implemented.");
  }

  async put<T>(url: string, data: any) {
    throw new Error("Method not implemented.");
  }

  async delete<T>(url: string, data: any) {
    throw new Error("Method not implemented.");
  }
}
