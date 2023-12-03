import YnabProvider from "@/app/_providers/ynab-provider";
import { NextResponse } from "next/server";

let ynabService = YnabProvider.getInstance();

export async function GET() {
  let res = await ynabService.getBudgetSummary();
  return NextResponse.json(res.data);
}
