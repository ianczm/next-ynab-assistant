import { AccountSchema } from "@/data/common/accounts";
import { configService } from "@/services/backend/config-service";
import { ynabProvider } from "@/services/backend/ynab-service";
import { NextRequest, NextResponse } from "next/server";

const ynab = ynabProvider.get();

export async function POST(request: NextRequest) {
  const parsedRequest = AccountSchema.safeParse(await request.json());

  if (!parsedRequest.success) {
    return NextResponse.json(
      {
        error: {
          message: "Invalid account type.",
        },
      },
      { status: 400 },
    );
  }

  const accountReconciliation = parsedRequest.data;

  const { YNAB_DEFAULT_BUDGET_ID } = configService.get();

  const accountReconciliationResponse = await ynab.postReconcileAccount(YNAB_DEFAULT_BUDGET_ID, accountReconciliation);
  return NextResponse.json(accountReconciliationResponse);
}
