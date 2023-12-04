import { NextRequest, NextResponse } from "next/server";
import { Toll, TollSchema } from "@/app/_types/tolls";
import YnabProvider from "@/app/_providers/ynab-provider";
import { z } from "zod";

let ynab = YnabProvider.getInstance();

export async function POST(request: NextRequest, { params }: { params: { budgetId: string } }) {
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
    const addedTolls = await ynab.createTollTransactions(tolls);
    return NextResponse.json({ transactions: addedTolls });
  }
}
