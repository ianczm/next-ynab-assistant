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

  async get<T>(url: string) {
    return await fetch(this.baseUrl + url, this.baseInit("GET")).then((response) => response.json() as T);
  }

  async options<T>(url: string) {
    throw new Error("Method not implemented.");
  }

  async head<T>(url: string) {
    throw new Error("Method not implemented.");
  }

  async post<T>(url: string, data: any) {
    return await fetch(this.baseUrl + url, {
      ...this.baseInitNoCache("POST"),
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
