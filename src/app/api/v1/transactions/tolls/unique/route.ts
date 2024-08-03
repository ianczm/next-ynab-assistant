import { milliUnitsToCurrency } from "@/lib/utils/currency";
import { configService } from "@/services/backend/config-service";
import { ynabProvider } from "@/services/backend/ynab-service";
import { Toll } from "@/types/common/tolls";
import _ from "lodash";
import { NextResponse } from "next/server";

const ynab = ynabProvider.get();

export async function GET() {
  const { YNAB_DEFAULT_BUDGET_ID } = configService.get();
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
    .countBy((toll) => JSON.stringify({ name: toll.name, amount: toll.amount }, null, 0))
    .map((count, tollJson) => {
      const tollKey = JSON.parse(tollJson) as Toll;
      return {
        ...tolls.find((toll) => toll.name == tollKey.name && toll.amount == tollKey.amount),
        count: count,
      };
    })
    .filter((toll) => toll.count > 1)
    .sortBy((toll) => -1 * toll.count)
    .map(({ count, ...toll }) => toll as Toll);

  return NextResponse.json({ data: tollsWithCount });
}
