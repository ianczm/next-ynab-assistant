import YnabService from "@/app/ynab/YnabService";
import { NextResponse } from "next/server";

// todo: use provider for dependency injection instead
let ynabService = new YnabService();

export async function GET() {
  let res = await ynabService.getCurrentBudget();
  return NextResponse.json(res.data);
}
