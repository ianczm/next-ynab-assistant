import { YnabDomain } from "@/services/api-dto";
import { Account } from "@/types/domain/accounts";
import { AccountNavOption } from "@/types/frontend/navigation";
import moment from "moment";

export namespace AccountMapper {
  // frontend

  export function toNavOption(account: Account): AccountNavOption {
    return {
      id: account.id,
      label: account.name,
      href: `/investments/${account.id}`,
      balance: account.balance,
      disabled: false,
    };
  }

  // backend

  export function toAccount(ynabAccount: YnabDomain.Account): Account {
    return {
      id: ynabAccount.id,
      balance: ynabAccount.balance,
      name: ynabAccount.name,
      note: ynabAccount.note ?? null,
      type: ynabAccount.type,
      lastReconciliation: moment(ynabAccount.last_reconciled_at).toISOString() ?? null,
    };
  }
}
