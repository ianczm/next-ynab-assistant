import { components } from "./api-specification";

type Schemas = components["schemas"];

export type YnabError = {
  error: {
    id: string;
    name: string;
    detail: string;
  };
};

// GET /user
export type CurrentUserResponse = Schemas["UserResponse"];

export namespace Budgets {
  // GET /budgets
  export type MultiResponse = Schemas["BudgetSummaryResponse"];

  // GET /budget/:budget_id
  export type Response = Schemas["BudgetDetailResponse"];
}

export namespace Accounts {
  // GET /budget/:budget_id/accounts
  export type MultiResponse = Schemas["AccountsResponse"];

  // POST /budget/:budget_id/accounts
  export type PostRequest = Schemas["PostAccountWrapper"];

  // POST /budget/:budget_id/accounts
  // GET /budget/:budget_id/accounts/:account_id
  export type Response = Schemas["AccountResponse"];
}

export namespace Categories {
  // GET /budgets/:budget_id/categories
}

export namespace Transactions {
  // GET /budgets/:budget_id/transactions
  export type MultiResponse = Schemas["TransactionsResponse"];

  // POST /budgets/:budget_id/transactions
  export type PostRequest = Schemas["PostTransactionsWrapper"];
  export type PostResponse = Schemas["SaveTransactionsResponse"];

  // PATCH /budgets/:budget_id/transactions
  export type PatchRequest = Schemas["PatchTransactionsWrapper"];
  export type PatchResponse = Schemas["SaveTransactionsResponse"];

  // GET /budgets/:budget_id/transactions/:transaction_id
  // GET /budgets/:budget_id/accounts/:transaction_id
  export type Response = Schemas["TransactionResponse"];

  // PUT /budgets/:budget_id/transactions/:transaction_id
  export type PutRequest = Schemas["PutTransactionWrapper"];
  export type PutResponse = Schemas["SaveTransaction"];

  // GET /budgets/:budget_id/categories/:transaction_id
  // GET /budgets/:budget_id/payees/:transaction_id
  export type HybridMultiResponse = Schemas["HybridTransactionsResponse"];

  export type SaveTransaction = Schemas["SaveTransaction"];
}

// Domain
export namespace YnabDomain {
  export type User = Schemas["User"];
  export type BudgetDetail = Schemas["BudgetDetail"];
  export type Account = Schemas["Account"];
  export type TransactionDetail = Schemas["TransactionDetail"];
  export type SubTransaction = Schemas["SubTransaction"];
}
