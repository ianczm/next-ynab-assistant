import YnabProvider from "@/app/providers/ynab-provider";
import { NextResponse } from "next/server";

let ynabService = YnabProvider.getInstance();

export async function GET() {
  let res = await ynabService.getCurrentBudget();
  return NextResponse.json(res.data);
}
