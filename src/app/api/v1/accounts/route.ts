import { Account, accountToDescriptionMap } from "@/data/common/accounts";
import { milliUnitsToCurrency } from "@/lib/utils/currency";
import { configService } from "@/services/backend/config-service";
import { ynabProvider } from "@/services/backend/ynab-service";
import { NextResponse } from "next/server";

const ynab = ynabProvider.get();

export async function GET() {
  const { YNAB_DEFAULT_BUDGET_ID } = configService.get();

  const response = await ynab.getAllAccounts(YNAB_DEFAULT_BUDGET_ID);

  const accounts = response.data.accounts;

  const data = accounts.map((account) => {
    const description = accountToDescriptionMap[account.id];
    return {
      id: account.id,
      name: account.name,
      balance: milliUnitsToCurrency(account.balance),
      reconciliationInfo: description ?? accountToDescriptionMap["DEFAULT"],
    } as Account;
  });

  return NextResponse.json({ data });
}
