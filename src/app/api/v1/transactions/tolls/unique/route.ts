import YnabProvider from "@/providers/ynab-provider";
import ServerConfigProvider from "@/providers/server-config-provider";
import { NextResponse } from "next/server";
import _ from "lodash";
import { Toll } from "@/types/domain/tolls";
import { milliUnitsToCurrency } from "@/lib/utils/currency";

let ynab = YnabProvider.get();

export async function GET() {
  const { YNAB_DEFAULT_BUDGET_ID } = ServerConfigProvider.get();
  const transactions = await ynab
    .getAllTransactions(YNAB_DEFAULT_BUDGET_ID)
    .then((response) => response.data.transactions);

  // get unique tolls
  const tolls = _(transactions)
    .filter((transaction) => transaction.payee_name === "Tolls" || transaction.category_name === "Tolls")
    .map(
      (transaction) =>
        ({
          name: transaction.memo ?? "",
          displayName: transaction.memo ?? "",
          amount: -1 * milliUnitsToCurrency(transaction.amount),
        }) as Toll,
    );

  const tollsWithCount = tolls
    .countBy((toll) => toll.name)
    .map((count, tollName) => ({
      ...tolls.find((toll) => toll.name == tollName),
      count: count,
    }))
    .filter((toll) => toll.count > 1)
    .sortBy((toll) => -1 * toll.count)
    .map(({ count, ...toll }) => toll as Toll);

  return NextResponse.json({ data: tollsWithCount });
}
