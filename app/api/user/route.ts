import YnabProvider from "@/app/providers/YnabProvider";
import { NextResponse } from "next/server";

let ynabService = YnabProvider.getInstance();

export async function GET() {
  let res = await ynabService.getCurrentUser();
  return NextResponse.json(res.data);
}
