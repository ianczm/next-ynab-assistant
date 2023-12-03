import { ReceivablesService } from "@/app/services/receivables-service";
import ReceivablesProvider from "@/app/providers/receivables-provider";

export default async function ReceivablesPage({ params }: Readonly<{ params: { budgetId: string } }>) {
  function buildCurrencyString(amount: number) {
    let result = (Math.abs(amount) / 1000).toFixed(2);
    return amount < 0 ? `(${result})` : result;
  }

  const receivablesService: ReceivablesService = ReceivablesProvider.getInstance();
  const payees = await receivablesService.getReceivables(params.budgetId);
  const totalOutstandingAmount = payees.reduce((amount, payee) => payee.outstandingAmount + amount, 0);

  return (
    <main className="flex min-h-screen flex-col p-36">
      <div className="mb-20">
        <p>
          <b>Budget</b>: {params.budgetId}
        </p>
        <p>
          <b>Outstanding amount</b>: {buildCurrencyString(totalOutstandingAmount)}
        </p>
      </div>
      <div>
        <ul className="flex flex-col gap-8">
          {payees
            .filter((payee) => payee.outstandingAmount !== 0)
            .sort((pa, pb) => pa.outstandingAmount - pb.outstandingAmount)
            .map((payee) => (
              <li key={payee.payeeId} data-payee-id={payee.payeeId}>
                <div className="flex justify-between">
                  <b>{payee.payeeName}</b>
                  <p data-is-negative={payee.outstandingAmount < 0}>{buildCurrencyString(payee.outstandingAmount)}</p>
                </div>
                <ul className="pl-8">
                  {payee.occasions
                    .filter((occasion) => occasion.outstandingAmount !== 0)
                    .map((occasion) => (
                      <li key={occasion.memo}>
                        <div className="flex justify-between">
                          <p>{occasion.memo}</p>
                          <p data-is-negative={occasion.outstandingAmount < 0}>
                            {buildCurrencyString(occasion.outstandingAmount)}
                          </p>
                        </div>
                        <ul className="pl-8">
                          {occasion.transactions.map((transaction) => (
                            <li key={transaction.id} data-transaction-id={transaction.id}>
                              <div className="flex justify-between">
                                <p>
                                  {occasion.memo === "Uncombined"
                                    ? ReceivablesService.getMergedMemo(transaction)
                                    : transaction.memo}
                                </p>
                                <p data-is-negative={transaction.amount < 0}>
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
