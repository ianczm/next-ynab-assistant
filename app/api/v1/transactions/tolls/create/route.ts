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
      {
        error: {
          message: "Invalid toll type.",
        },
      },
      { status: 400 },
    );
  } else {
    const tolls: Toll[] = parsedRequest.data;
    const { YNAB_DEFAULT_BUDGET_ID } = ConfigProvider.get();
    const addedTolls = await ynab.createTollTransactions(YNAB_DEFAULT_BUDGET_ID, tolls);
    return NextResponse.json({ transactions: addedTolls });
  }
}
