import { NextRequest, NextResponse } from "next/server";
import { Toll } from "@/types/domain/tolls";
import YnabProvider from "@/providers/ynab-provider";
import ServerConfigProvider from "@/providers/server-config-provider";
import { TollsDTOSchema } from "@/types/dto/transactions";
import moment from "moment";
import { z } from "zod";

let ynab = YnabProvider.get();

export async function POST(request: NextRequest) {
  const parsedRequest = TollsDTOSchema.safeParse(await request.json());
  const selectedDate = z.coerce
    .date()
    .transform((date) => moment(date))
    .refine((date) => date.isSameOrBefore(moment().utcOffset(8), "day"), "Date should not be in the future.")
    .safeParse(request.headers.get("Data-Date"));

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

  if (!selectedDate.success) {
    return NextResponse.json(
      {
        error: {
          message: "Date should be valid and not in the future.",
        },
      },
      { status: 400 },
    );
  }

  const tolls: Toll[] = parsedRequest.data.data;
  const { YNAB_DEFAULT_BUDGET_ID } = ServerConfigProvider.get();
  const addedTolls = await ynab.createTollTransactions(YNAB_DEFAULT_BUDGET_ID, tolls, selectedDate.data);
  const output = TollsDTOSchema.parse({ data: addedTolls });
  return NextResponse.json(output);
}
