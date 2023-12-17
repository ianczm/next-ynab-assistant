import { NextRequest, NextResponse } from "next/server";
import { Toll } from "@/types/domain/tolls";
import YnabProvider from "@/providers/ynab-provider";
import ServerConfigProvider from "@/providers/server-config-provider";
import { TollsDTOSchema } from "@/types/dto/transactions";

let ynab = YnabProvider.get();

export async function POST(request: NextRequest) {
  const parsedRequest = TollsDTOSchema.safeParse(await request.json());

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
    const tolls: Toll[] = parsedRequest.data.data;
    const { YNAB_DEFAULT_BUDGET_ID } = ServerConfigProvider.get();
    const addedTolls = await ynab.createTollTransactions(YNAB_DEFAULT_BUDGET_ID, tolls);
    const output = TollsDTOSchema.parse({ data: addedTolls });
    return NextResponse.json(output);
  }
}
