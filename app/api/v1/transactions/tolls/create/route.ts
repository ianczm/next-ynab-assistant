import { NextRequest, NextResponse } from "next/server";
import { Toll, TollSchema } from "@/types/domain/tolls";
import YnabProvider from "@/providers/ynab-provider";
import { z } from "zod";
import ConfigProvider from "@/providers/config-provider";

let ynab = YnabProvider.getInstance();

export async function POST(request: NextRequest) {
  const parsedRequest = z.array(TollSchema).safeParse(await request.json());

  if (!parsedRequest.success) {
    return NextResponse.json(
      // Todo: proper error handling
      {
        error: {
          message: "Invalid toll type.",
        },
      },
      { status: 400 },
    );
  } else {
    const tolls: Toll[] = parsedRequest.data;
    // Todo: next time should receive budgetId through request
    const { YNAB_DEFAULT_BUDGET_ID } = ConfigProvider.get();
    const addedTolls = await ynab.createTollTransactions(YNAB_DEFAULT_BUDGET_ID, tolls);
    // Todo: should establish common DTO/contract between client and API that adheres to JSON API specifications
    return NextResponse.json({ transactions: addedTolls });
  }
}
