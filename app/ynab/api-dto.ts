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
  export type BudgetSummaryResponse = Schemas["BudgetSummaryResponse"];

  // GET /budget/:budget_id
  export type BudgetDetailResponse = Schemas["BudgetDetailResponse"];
}

export namespace Accounts {
  // GET /budget/:budget_id/accounts
  export type AccountsResponse = Schemas["AccountsResponse"];

  // POST /budget/:budget_id/accounts
  export type AccountPostRequest = Schemas["PostAccountWrapper"];
  export type AccountPostResponse = AccountResponse;

  // GET /budget/:budget_id/accounts/:account_id
  export type AccountResponse = Schemas["AccountResponse"];
}

export namespace Categories {
  // GET /budgets/:budget_id/categories
}

export namespace Transactions {
  // GET /budgets/:budget_id/transactions
  export type TransactionsResponse = Schemas["TransactionsResponse"];

  // POST /budgets/:budget_id/transactions
  export type TransactionsPostRequest = Schemas["PostTransactionsWrapper"];
  export type TransactionsPostResponse = Schemas["SaveTransactionsResponse"];

  // PATCH /budgets/:budget_id/transactions
  export type TransactionsPatchRequest = Schemas["PatchTransactionsWrapper"];
  export type TransactionsPatchResponse = Schemas["SaveTransactionsResponse"];

  // GET /budgets/:budget_id/transactions/:transaction_id
  // GET /budgets/:budget_id/accounts/:transaction_id
  export type TransactionResponse = Schemas["TransactionResponse"];

  // PUT /budgets/:budget_id/transactions/:transaction_id
  export type TransactionPutRequest = Schemas["PutTransactionWrapper"];
  export type TransactionPutResponse = Schemas["SaveTransaction"];

  // GET /budgets/:budget_id/categories/:transaction_id
  // GET /budgets/:budget_id/payees/:transaction_id
  export type HybridTransactionResponse = Schemas["HybridTransactionsResponse"];
}

// Domain
export type User = Schemas["User"];
export type BudgetDetail = Schemas["BudgetDetail"];
export type Acocunt = Schemas["Account"];
export type TransactionDetail = Schemas["TransactionDetail"];
export type SubTransaction = Schemas["SubTransaction"];
