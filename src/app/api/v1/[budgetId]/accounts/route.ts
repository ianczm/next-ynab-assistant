import YnabProvider from "@/providers/ynab-provider";
import { NextRequest, NextResponse } from "next/server";

import { AccountMapper } from "@/lib/mappers/account";

let ynabService = YnabProvider.get();

export async function GET(request: NextRequest, { params }: { params: { budgetId: string } }) {
  const res = await ynabService.getAllAccounts(params.budgetId);
  return NextResponse.json({
    data: res.data.accounts.map(AccountMapper.toAccount),
  });
}
