import { NextRequest, NextResponse } from "next/server";
import { Toll } from "@/types/domain/tolls";
import YnabProvider from "@/providers/ynab-provider";
import ServerConfigProvider from "@/providers/server-config-provider";
import { TollsDTOSchema } from "@/types/dto/transactions";
import moment, { Moment } from "moment";

let ynab = YnabProvider.get();

export async function POST(request: NextRequest) {
  const parsedRequest = TollsDTOSchema.safeParse(await request.json());
  const selectedDate = request.headers.get("Data-Date");

  if (!parsedRequest.success) {
    return NextResponse.json(
      {
        error: {
          message: "Invalid toll type.",
        },
      },
      { status: 400 },
    );
  } else if (selectedDate === null) {
    return NextResponse.json(
      {
        error: {
          message: "Date is null.",
        },
      },
      { status: 400 },
    );
  } else {
    const tolls: Toll[] = parsedRequest.data.data;
    let parsedSelectedDate: Moment;

    try {
      parsedSelectedDate = moment(selectedDate);
    } catch (e) {
      return NextResponse.json(
        {
          error: {
            message: "Date is invalid.",
            details: e,
          },
        },
        { status: 400 },
      );
    }

    const { YNAB_DEFAULT_BUDGET_ID } = ServerConfigProvider.get();
    const addedTolls = await ynab.createTollTransactions(YNAB_DEFAULT_BUDGET_ID, tolls, parsedSelectedDate);
    const output = TollsDTOSchema.parse({ data: addedTolls });
    return NextResponse.json(output);
  }
}
