import { parseType } from "@/lib/mappers/transactions";
import { milliUnitsToCurrency } from "@/lib/utils/currency";
import YnabProvider from "@/providers/ynab-provider";
import {
  SimpleTransactionDTO,
  SimpleTransactionDTOSchema,
  SimpleTransactionListDTOSchema,
} from "@/types/domain/transactions";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: {
    budgetId: string;
    accountId: string;
  };
};

let ynabService = YnabProvider.get();

export async function GET(request: NextRequest, { params }: RouteParams) {
  // Headers
  const revalidate = request.headers.get("Data-Revalidate") === "true";

  const response = await ynabService.getAllTransactions(params.budgetId, revalidate);
  const result = response.data.transactions
    .filter((transaction) => transaction.account_id === params.accountId)
    .map((transaction) => ({
      id: transaction.id,
      date: moment(transaction.date).toISOString(),
      amount: milliUnitsToCurrency(transaction.amount),
      type: parseType(transaction.memo ?? null),
    }));
  return NextResponse.json(SimpleTransactionListDTOSchema.parse({ data: result }));
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const parsedRequest = SimpleTransactionDTOSchema.safeParse(await request.json());

  if (!parsedRequest.success) {
    return NextResponse.json(
      {
        error: {
          message: "Invalid toll type.",
        },
      },
      { status: 400 },
    );
  }

  const investment: SimpleTransactionDTO = parsedRequest.data;
  const result = await ynabService.createInvestment(params.budgetId, params.accountId, investment);

  return NextResponse.json({ data: result });
}
