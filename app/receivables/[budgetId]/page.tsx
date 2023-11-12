import { ReceivablesService } from "@/app/services/receivables-service";
import ReceivablesProvider from "@/app/providers/receivables-provider";

export default async function ReceivablesPage({ params }: Readonly<{ params: { budgetId: string } }>) {
  const receivablesService: ReceivablesService = ReceivablesProvider.getInstance();
  const payees = await receivablesService.getReceivables(params.budgetId);

  function buildCurrencyString(amount: number) {
    let result = (Math.abs(amount) / 1000).toFixed(2);
    return amount < 0 ? `(${result})` : result;
  }

  return (
    <main className="flex flex-col min-h-screen p-36">
      <div className="mb-20">
        <p>This is the receivables page of budget: {params.budgetId}</p>
      </div>
      <div>
        <ul className="flex flex-col gap-8">
          {payees
            .filter((payee) => payee.outstandingAmount !== 0)
            .map((payee) => (
              <li key={payee.payeeId} data-payeeId={payee.payeeId}>
                <div className="flex justify-between">
                  <b>{payee.payeeName}</b>
                  <p data-isNegative={payee.outstandingAmount < 0}>{buildCurrencyString(payee.outstandingAmount)}</p>
                </div>
                <ul className="pl-8">
                  {payee.occasions
                    .filter((occasion) => occasion.outstandingAmount !== 0)
                    .map((occasion) => (
                      <li key={occasion.memo}>
                        <div className="flex justify-between">
                          <p>{occasion.memo}</p>
                          <p data-isNegative={occasion.outstandingAmount < 0}>
                            {buildCurrencyString(occasion.outstandingAmount)}
                          </p>
                        </div>
                        <ul className="pl-8">
                          {occasion.transactions.map((transaction) => (
                            <li key={transaction.id} data-transactionId={transaction.id}>
                              <div className="flex justify-between">
                                <p>
                                  {occasion.memo === "Uncombined"
                                    ? ReceivablesService.getMergedMemo(transaction)
                                    : transaction.memo}
                                </p>
                                <p data-isNegative={transaction.amount < 0}>
                                  {buildCurrencyString(transaction.amount)}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                </ul>
              </li>
            ))}
        </ul>
      </div>
    </main>
  );
}
