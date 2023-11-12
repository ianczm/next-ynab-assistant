import { ExtendedTransaction, FlagColor, Payee, Transaction } from "@/app/services/models";
import _ from "lodash";
import { TransactionMapper } from "@/app/services/transaction-mapper";
import YnabService from "@/app/services/ynab-service";

export class ReceivablesService {
  constructor(readonly ynabService: YnabService) {}

  private static isReceivable(transaction: ExtendedTransaction) {
    return transaction.category.name === "General Receivables";
  }

  private static isUnresolved(transaction: ExtendedTransaction) {
    return transaction.flagColor !== FlagColor.GREEN;
  }

  static getMergedMemo(transaction: Transaction) {
    if (transaction.memo?.includes("/")) {
      return transaction.memo;
    } else {
      return [transaction.parentMemo, transaction.memo].filter((s) => !!s).join(" / ");
    }
  }

  async getReceivables(budgetId: string) {
    let response = await this.ynabService.getAllTransactions(budgetId);
    let transactions = response.data.transactions.flatMap(TransactionMapper.transactionToExtendedModels);

    return _(transactions)
      .filter(ReceivablesService.isReceivable)
      .filter(ReceivablesService.isUnresolved)
      .groupBy((transaction) => transaction.payee.name)
      .map((transactions, payeeName): Payee<Transaction> => {
        let _transactions = _(transactions);
        let _groupedByMemo = _transactions
          .groupBy(ReceivablesService.getMergedMemo)
          .map((transactions, mergedMemo) =>
            TransactionMapper.transactionsToOccasion(
              _(transactions).map(TransactionMapper.extendedTransactionToTransaction),
              mergedMemo,
            ),
          );

        let [_uncombinedOccasions, _groupedByMemoGeOne] = _.partition(
          _groupedByMemo.value(),
          (occasion) => occasion.transactions.length <= 1,
        );

        let _uncombinedOccasion = TransactionMapper.transactionsToOccasion(
          _(_uncombinedOccasions).flatMap((occasion) => occasion.transactions),
        );

        return {
          payeeId: _transactions.first()!.payee.id ?? null,
          payeeName: payeeName,
          outstandingAmount: _transactions.sumBy((transactions) => transactions.amount),
          occasions: [_uncombinedOccasion, ..._groupedByMemoGeOne].filter(
            (occasion) => occasion.transactions.length > 0,
          ),
        };
      })
      .value();
  }
}
