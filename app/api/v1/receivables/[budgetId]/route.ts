import { NextRequest, NextResponse } from "next/server";
import ReceivablesProvider from "@/app/providers/receivables-provider";

let receivablesService = ReceivablesProvider.getInstance();

export async function GET(request: NextRequest, { params }: { params: { budgetId: string } }) {
  let result = await receivablesService.getReceivables(params.budgetId);
  return NextResponse.json(result);
}
