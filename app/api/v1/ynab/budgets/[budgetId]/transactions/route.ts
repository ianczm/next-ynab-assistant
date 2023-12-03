import YnabProvider from "@/app/_providers/ynab-provider";
import { NextRequest, NextResponse } from "next/server";

let ynabService = YnabProvider.getInstance();

export async function GET(request: NextRequest, { params }: { params: { budgetId: string } }) {
  let res = await ynabService.getAllTransactions(params.budgetId);
  return NextResponse.json(res.data);
}
