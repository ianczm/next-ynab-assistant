import YnabProvider from "@/providers/ynab-provider";
import { NextResponse } from "next/server";

let ynabService = YnabProvider.get();

export async function GET() {
  let res = await ynabService.getBudgetSummary();
  return NextResponse.json(res.data);
}
