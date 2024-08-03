import { TollsDTOSchema } from "@/data/backend/internal/tolls";
import { Toll } from "@/data/common/tolls";
import { configService } from "@/services/backend/config-service";
import { ynabProvider } from "@/services/backend/ynab-service";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ynab = ynabProvider.get();

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
  const { YNAB_DEFAULT_BUDGET_ID } = configService.get();
  const addedTolls = await ynab.createTollTransactions(YNAB_DEFAULT_BUDGET_ID, tolls, selectedDate.data);
  const output = TollsDTOSchema.parse({ data: addedTolls });
  return NextResponse.json(output);
}
